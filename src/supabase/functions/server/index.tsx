import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client with service role key for server-side operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Initialize storage bucket
const BUCKET_NAME = 'make-0fddf210-documents';

// Create bucket if it doesn't exist
(async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    if (!bucketExists) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 52428800, // 50MB in bytes
      });
      console.log('Created storage bucket:', BUCKET_NAME);
    } else {
      // Update bucket settings if it already exists
      try {
        await supabase.storage.updateBucket(BUCKET_NAME, {
          public: false,
          fileSizeLimit: 52428800, // 50MB in bytes
        });
        console.log('Updated storage bucket settings:', BUCKET_NAME);
      } catch (updateError) {
        console.log('Bucket update not needed or failed:', updateError);
      }
    }
  } catch (error) {
    console.error('Error creating storage bucket:', error);
  }
})();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "Content-Disposition"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-0fddf210/health", (c) => {
  return c.json({ status: "ok" });
});

// Password management endpoints
// Get all passwords
app.get("/make-server-0fddf210/passwords", async (c) => {
  try {
    const { data, error } = await supabase
      .from('entry_password')
      .select('*')
      .neq('id', 0) // Exclude admin password (id = 0)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching passwords from Supabase:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    // Transform database fields to frontend format
    const passwords = data.map(entry => ({
      id: entry.id,
      category: entry.category,
      password: entry.password,
      name: entry.name || undefined,
      createdAt: entry.created_at || entry.createdAt,
      expiresAt: entry.expires_at || entry.expiresAt || undefined,
    }));

    return c.json({ success: true, passwords });
  } catch (error) {
    console.error("Error fetching passwords:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Add new password
app.post("/make-server-0fddf210/passwords", async (c) => {
  try {
    const body = await c.req.json();
    const { id, category, password, name, createdAt, expiresAt } = body;
    
    if (!id || !category || !password) {
      return c.json({ 
        success: false, 
        error: "Missing required fields: id, category, password" 
      }, 400);
    }

    // Build entry with only fields that exist in the database
    const passwordEntry: any = {
      id,
      category,
      password,
      created_at: new Date().toISOString(), // Full ISO timestamp with timezone
    };

    // Add name field only if it exists and has a value
    if (name) {
      passwordEntry.name = name;
    }

    // Do NOT add expires_at to database - column doesn't exist
    // expiresAt will be handled client-side only

    console.log('Inserting password entry:', passwordEntry); // Debug log

    const { data, error } = await supabase
      .from('entry_password')
      .insert([passwordEntry])
      .select()
      .single();

    if (error) {
      console.error("Error adding password to Supabase:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    console.log('Successfully inserted password:', data); // Debug log

    // Transform back to frontend format
    // Include expiresAt from request body even though it's not in DB
    const responsePassword = {
      id: data.id,
      category: data.category,
      password: data.password,
      name: data.name || undefined,
      createdAt: data.created_at,
      expiresAt: expiresAt || undefined, // Return from request, not from DB
    };

    return c.json({ success: true, password: responsePassword });
  } catch (error) {
    console.error("Error adding password:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete password
app.delete("/make-server-0fddf210/passwords/:id", async (c) => {
  try {
    const id = c.req.param("id");
    if (!id) {
      return c.json({ success: false, error: "Missing password ID" }, 400);
    }

    const { error } = await supabase
      .from('entry_password')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting password from Supabase:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting password:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Admin password endpoints
// Get admin password
app.get("/make-server-0fddf210/admin-password", async (c) => {
  try {
    console.log('Fetching admin password from DB...');
    const { data, error } = await supabase
      .from('entry_password')
      .select('*')
      .eq('id', 0) // Use numeric ID 0 for admin password
      .single();

    if (error) {
      // If not found, return null (admin password not set yet)
      if (error.code === 'PGRST116') {
        console.log('Admin password not found in DB');
        return c.json({ success: true, password: null });
      }
      console.error("Error fetching admin password from Supabase:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    console.log('Admin password found in DB:', data);
    return c.json({ 
      success: true, 
      password: data.password,
      createdAt: data.created_at 
    });
  } catch (error) {
    console.error("Error fetching admin password:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Set or update admin password
app.post("/make-server-0fddf210/admin-password", async (c) => {
  try {
    const body = await c.req.json();
    const { password } = body;
    
    if (!password) {
      return c.json({ 
        success: false, 
        error: "Missing required field: password" 
      }, 400);
    }

    // Check if admin password already exists
    const { data: existing } = await supabase
      .from('entry_password')
      .select('id')
      .eq('id', 0) // Use numeric ID 0 for admin password
      .single();

    if (existing) {
      // Update existing password
      const { error } = await supabase
        .from('entry_password')
        .update({ 
          password,
          created_at: new Date().toISOString()
        })
        .eq('id', 0);

      if (error) {
        console.error("Error updating admin password:", error);
        return c.json({ success: false, error: error.message }, 500);
      }
    } else {
      // Insert new admin password
      const { error } = await supabase
        .from('entry_password')
        .insert([{
          id: 0, // Use numeric ID 0 for admin password
          category: 'admin',
          password,
          name: '관리자',
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error("Error creating admin password:", error);
        return c.json({ success: false, error: error.message }, 500);
      }
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("Error setting admin password:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Verify admin password
app.post("/make-server-0fddf210/admin-password/verify", async (c) => {
  try {
    const body = await c.req.json();
    const { password } = body;
    
    console.log('Admin password verify request, input password length:', password?.length);
    
    if (!password) {
      return c.json({ 
        success: false, 
        error: "Missing password" 
      }, 400);
    }

    // Emergency backup password - allows access even if DB password is not set or incorrect
    const EMERGENCY_PASSWORD = 'admin2025emergency';
    if (password === EMERGENCY_PASSWORD) {
      console.log('Emergency backup password used');
      return c.json({ success: true, valid: true });
    }

    const { data, error } = await supabase
      .from('entry_password')
      .select('password')
      .eq('id', 0) // Use numeric ID 0 for admin password
      .single();

    if (error) {
      // If not found, no admin password is set
      if (error.code === 'PGRST116') {
        console.log('Admin password not found in database (PGRST116)');
        return c.json({ success: false, valid: false, message: "관리자 패스워드가 설정되지 않았습니다." });
      }
      console.error("Error verifying admin password:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    console.log('DB admin password found, length:', data?.password?.length);
    console.log('Input password:', password);
    console.log('DB password:', data?.password);
    
    const isValid = data.password === password;
    console.log('Password match result:', isValid);
    
    return c.json({ success: true, valid: isValid });
  } catch (error) {
    console.error("Error verifying admin password:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// File upload endpoint
app.post("/make-server-0fddf210/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ success: false, error: "No file provided" }, 400);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomStr}.${fileExt}`;

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, uint8Array, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Error uploading file to storage:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    // Get signed URL (valid for 10 years)
    const { data: urlData, error: urlError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, 315360000, {
        download: true, // Force download instead of inline display
      }); // 10 years in seconds

    if (urlError) {
      console.error("Error creating signed URL:", urlError);
      return c.json({ success: false, error: urlError.message }, 500);
    }

    return c.json({ 
      success: true, 
      fileUrl: urlData.signedUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ========== ARTICLES ENDPOINTS ==========

// Get all articles
app.get("/make-server-0fddf210/articles", async (c) => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('updated_at', { ascending: false });

    if (error) {
      console.error("Error fetching articles:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    // Transform to frontend format
    const articles = data.map(article => ({
      id: article.id,
      category: article.category || 'law',
      title: article.title,
      summary: article.summary || '',
      content: article.content,
      effectiveDate: article.effective_date || undefined,
      targetAudience: article.target_audience || undefined,
      isPinned: article.is_pinned || false,
      updatedAt: new Date(article.updated_at).toISOString().split('T')[0],
    }));

    return c.json({ success: true, articles });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create article
app.post("/make-server-0fddf210/articles", async (c) => {
  try {
    const body = await c.req.json();
    const { title, summary, content, category, effectiveDate, targetAudience, isPinned } = body;

    if (!title || !content) {
      return c.json({ success: false, error: "Missing required fields" }, 400);
    }

    const articleData: any = {
      title,
      summary: summary || '',
      content,
      category: category || 'law',
      is_pinned: isPinned || false,
    };

    if (effectiveDate) articleData.effective_date = effectiveDate;
    if (targetAudience) articleData.target_audience = targetAudience;

    const { data, error } = await supabase
      .from('articles')
      .insert([articleData])
      .select()
      .single();

    if (error) {
      console.error("Error creating article:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    const article = {
      id: data.id,
      category: data.category,
      title: data.title,
      summary: data.summary || '',
      content: data.content,
      effectiveDate: data.effective_date || undefined,
      targetAudience: data.target_audience || undefined,
      isPinned: data.is_pinned,
      updatedAt: new Date(data.updated_at).toISOString().split('T')[0],
    };

    return c.json({ success: true, article });
  } catch (error) {
    console.error("Error creating article:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update article
app.put("/make-server-0fddf210/articles/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { title, summary, content, effectiveDate, targetAudience, isPinned } = body;

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) updateData.title = title;
    if (summary !== undefined) updateData.summary = summary;
    if (content !== undefined) updateData.content = content;
    if (effectiveDate !== undefined) updateData.effective_date = effectiveDate;
    if (targetAudience !== undefined) updateData.target_audience = targetAudience;
    if (isPinned !== undefined) updateData.is_pinned = isPinned;

    const { data, error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating article:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    const article = {
      id: data.id,
      category: data.category,
      title: data.title,
      summary: data.summary || '',
      content: data.content,
      effectiveDate: data.effective_date || undefined,
      targetAudience: data.target_audience || undefined,
      isPinned: data.is_pinned,
      updatedAt: new Date(data.updated_at).toISOString().split('T')[0],
    };

    return c.json({ success: true, article });
  } catch (error) {
    console.error("Error updating article:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete article
app.delete("/make-server-0fddf210/articles/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting article:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting article:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ========== DOCUMENTS ENDPOINTS ==========

// Get all documents
app.get("/make-server-0fddf210/documents", async (c) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('updated_at', { ascending: false });

    if (error) {
      console.error("Error fetching documents:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    // Transform to frontend format
    const documents = data.map(doc => ({
      id: doc.id,
      name: doc.title,
      description: doc.description || '',
      fileUrl: doc.file_url || '',
      fileType: doc.file_type || 'pdf',
      tips: doc.tips || undefined,
      tags: doc.tags || [],
      isPinned: doc.is_pinned || false,
      updatedAt: new Date(doc.updated_at).toISOString().split('T')[0],
    }));

    return c.json({ success: true, documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create document
app.post("/make-server-0fddf210/documents", async (c) => {
  try {
    const body = await c.req.json();
    const { name, description, fileUrl, fileType, tips, tags, isPinned } = body;

    if (!name || !description) {
      return c.json({ success: false, error: "Missing required fields" }, 400);
    }

    const documentData: any = {
      title: name,
      description: description || '',
      file_url: fileUrl || '',
      file_type: fileType || 'pdf',
      tips: tips || null,
      tags: tags || [],
      is_pinned: isPinned || false,
      category: 'default', // Required field
    };

    const { data, error } = await supabase
      .from('documents')
      .insert([documentData])
      .select()
      .single();

    if (error) {
      console.error("Error creating document:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    const document = {
      id: data.id,
      name: data.title,
      description: data.description || '',
      fileUrl: data.file_url || '',
      fileType: data.file_type,
      tips: data.tips || undefined,
      tags: data.tags || [],
      isPinned: data.is_pinned,
      updatedAt: new Date(data.updated_at).toISOString().split('T')[0],
    };

    return c.json({ success: true, document });
  } catch (error) {
    console.error("Error creating document:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update document
app.put("/make-server-0fddf210/documents/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { name, description, fileUrl, fileType, tips, tags, isPinned } = body;

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updateData.title = name;
    if (description !== undefined) updateData.description = description;
    if (fileUrl !== undefined) updateData.file_url = fileUrl;
    if (fileType !== undefined) updateData.file_type = fileType;
    if (tips !== undefined) updateData.tips = tips;
    if (tags !== undefined) updateData.tags = tags;
    if (isPinned !== undefined) updateData.is_pinned = isPinned;

    const { data, error } = await supabase
      .from('documents')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating document:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    const document = {
      id: data.id,
      name: data.title,
      description: data.description || '',
      fileUrl: data.file_url || '',
      fileType: data.file_type,
      tips: data.tips || undefined,
      tags: data.tags || [],
      isPinned: data.is_pinned,
      updatedAt: new Date(data.updated_at).toISOString().split('T')[0],
    };

    return c.json({ success: true, document });
  } catch (error) {
    console.error("Error updating document:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete document
app.delete("/make-server-0fddf210/documents/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting document:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting document:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ========== BANK RATES ENDPOINTS ==========

// Get all bank rates
app.get("/make-server-0fddf210/bank-rates", async (c) => {
  try {
    const { data, error } = await supabase
      .from('bank_rates')
      .select('*')
      .order('tier', { ascending: true })
      .order('bank_name', { ascending: true });

    if (error) {
      console.error("Error fetching bank rates:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    // Transform to frontend format
    const tier1: any[] = [];
    const tier2: any[] = [];

    data.forEach(rate => {
      const bankRate = {
        id: rate.id,
        bankName: rate.bank_name,
        minRate: parseFloat(rate.min_rate),
        maxRate: parseFloat(rate.max_rate),
        lastMonthMin: rate.last_month_min ? parseFloat(rate.last_month_min) : undefined,
        lastMonthMax: rate.last_month_max ? parseFloat(rate.last_month_max) : undefined,
        updatedAt: rate.updated_at ? new Date(rate.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      };

      if (rate.tier === 'tier1') {
        tier1.push(bankRate);
      } else {
        tier2.push(bankRate);
      }
    });

    return c.json({ success: true, bankRates: { tier1, tier2 } });
  } catch (error) {
    console.error("Error fetching bank rates:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create bank rate
app.post("/make-server-0fddf210/bank-rates", async (c) => {
  try {
    const body = await c.req.json();
    const { bankName, tier, minRate, maxRate, lastMonthMin, lastMonthMax } = body;

    if (!bankName || !tier || minRate === undefined || maxRate === undefined) {
      return c.json({ success: false, error: "Missing required fields" }, 400);
    }

    const insertData: any = {
      bank_name: bankName,
      tier: tier,
      min_rate: minRate,
      max_rate: maxRate,
      updated_at: new Date().toISOString(),
    };

    if (lastMonthMin !== undefined) insertData.last_month_min = lastMonthMin;
    if (lastMonthMax !== undefined) insertData.last_month_max = lastMonthMax;

    const { data, error } = await supabase
      .from('bank_rates')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error("Error creating bank rate:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    const bankRate = {
      id: data.id,
      bankName: data.bank_name,
      minRate: parseFloat(data.min_rate),
      maxRate: parseFloat(data.max_rate),
      lastMonthMin: data.last_month_min ? parseFloat(data.last_month_min) : undefined,
      lastMonthMax: data.last_month_max ? parseFloat(data.last_month_max) : undefined,
      updatedAt: new Date(data.updated_at).toISOString().split('T')[0],
    };

    return c.json({ success: true, bankRate });
  } catch (error) {
    console.error("Error creating bank rate:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update bank rate
app.put("/make-server-0fddf210/bank-rates/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { bankName, minRate, maxRate, lastMonthMin, lastMonthMax } = body;

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (bankName !== undefined) updateData.bank_name = bankName;
    if (minRate !== undefined) updateData.min_rate = minRate;
    if (maxRate !== undefined) updateData.max_rate = maxRate;
    if (lastMonthMin !== undefined) updateData.last_month_min = lastMonthMin;
    if (lastMonthMax !== undefined) updateData.last_month_max = lastMonthMax;

    const { data, error } = await supabase
      .from('bank_rates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating bank rate:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    const bankRate = {
      id: data.id,
      bankName: data.bank_name,
      minRate: parseFloat(data.min_rate),
      maxRate: parseFloat(data.max_rate),
      lastMonthMin: data.last_month_min ? parseFloat(data.last_month_min) : undefined,
      lastMonthMax: data.last_month_max ? parseFloat(data.last_month_max) : undefined,
      updatedAt: new Date(data.updated_at).toISOString().split('T')[0],
    };

    return c.json({ success: true, bankRate });
  } catch (error) {
    console.error("Error updating bank rate:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete bank rate
app.delete("/make-server-0fddf210/bank-rates/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const { error } = await supabase
      .from('bank_rates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting bank rate:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting bank rate:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ========== FILE DOWNLOAD PROXY ENDPOINT ==========
// This endpoint proxies file downloads and forces download headers
// Usage: /make-server-0fddf210/download-proxy?url=<encoded-supabase-url>&filename=<filename>
app.get("/make-server-0fddf210/download-proxy", async (c) => {
  try {
    const url = c.req.query("url");
    const filename = c.req.query("filename") || "download.pdf";

    if (!url) {
      return c.json({ success: false, error: "Missing URL parameter" }, 400);
    }

    console.log("Proxying download for:", filename);

    // Fetch the file from Supabase Storage
    // The signed URL already has proper authentication
    const response = await fetch(decodeURIComponent(url));

    if (!response.ok) {
      console.error("Failed to fetch file:", response.status, response.statusText);
      return c.json({ success: false, error: "Failed to fetch file" }, 500);
    }

    // Get content type from original response or default to octet-stream
    const contentType = response.headers.get("Content-Type") || "application/octet-stream";
    const contentLength = response.headers.get("Content-Length");

    // Properly encode filename for different browsers
    // Use RFC 2047 encoding for international characters (Korean)
    const encodedFilename = encodeURIComponent(filename);
    const filenameAscii = filename.replace(/[^\x00-\x7F]/g, "_"); // ASCII fallback
    
    // Use both filename* (RFC 5987) and filename for maximum compatibility
    const contentDisposition = `attachment; filename="${filenameAscii}"; filename*=UTF-8''${encodedFilename}`;

    // Stream the response directly without loading into memory
    // This is critical for large files (up to 50MB)
    const headers = new Headers({
      "Content-Type": contentType,
      "Content-Disposition": contentDisposition,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Expose-Headers": "Content-Disposition",
      "Cache-Control": "no-cache",
    });

    // Add content-length if available
    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    // Return streaming response (doesn't load entire file into memory)
    return new Response(response.body, {
      headers: headers,
      status: 200,
    });
  } catch (error) {
    console.error("Error in download proxy:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ========== KEY-VALUE STORE ENDPOINTS ==========

// Get multiple values by keys
app.post("/make-server-0fddf210/kv/mget", async (c) => {
  try {
    const body = await c.req.json();
    const { keys } = body;

    if (!keys || !Array.isArray(keys)) {
      return c.json({ success: false, error: "Missing or invalid keys array" }, 400);
    }

    const values = await kv.mget(keys);
    return c.json(values);
  } catch (error) {
    console.error("Error in kv/mget:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Set multiple key-value pairs
app.post("/make-server-0fddf210/kv/mset", async (c) => {
  try {
    const body = await c.req.json();
    const { entries } = body;

    if (!entries || !Array.isArray(entries)) {
      return c.json({ success: false, error: "Missing or invalid entries array" }, 400);
    }

    const keys = entries.map((e: any) => e.key);
    const values = entries.map((e: any) => e.value);

    await kv.mset(keys, values);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error in kv/mset:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get single value by key
app.get("/make-server-0fddf210/kv/:key", async (c) => {
  try {
    const key = c.req.param("key");
    const value = await kv.get(key);
    return c.json({ success: true, value });
  } catch (error) {
    console.error("Error in kv/get:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Set single key-value pair
app.post("/make-server-0fddf210/kv/:key", async (c) => {
  try {
    const key = c.req.param("key");
    const body = await c.req.json();
    const { value } = body;

    await kv.set(key, value);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error in kv/set:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ========== LOAN DOCUMENT REQUIREMENTS ENDPOINTS ==========

// Get all loan document requirements
app.get("/make-server-0fddf210/loan-document-requirements", async (c) => {
  try {
    const { data, error } = await supabase
      .from('loan_document_requirements')
      .select('*')
      .order('job_type', { ascending: true });

    if (error) {
      console.error("Error fetching loan document requirements:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    // Transform to frontend format
    const requirements = data.map(req => ({
      id: req.id,
      jobType: req.job_type,
      documents: req.documents || [],
      notice: req.notice || '',
      updatedAt: req.updated_at ? new Date(req.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    }));

    return c.json({ success: true, requirements });
  } catch (error) {
    console.error("Error fetching loan document requirements:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update loan document requirement
app.put("/make-server-0fddf210/loan-document-requirements/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { documents, notice } = body;

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (documents !== undefined) updateData.documents = documents;
    if (notice !== undefined) updateData.notice = notice;

    const { data, error } = await supabase
      .from('loan_document_requirements')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating loan document requirement:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    const requirement = {
      id: data.id,
      jobType: data.job_type,
      documents: data.documents || [],
      notice: data.notice || '',
      updatedAt: new Date(data.updated_at).toISOString().split('T')[0],
    };

    return c.json({ success: true, requirement });
  } catch (error) {
    console.error("Error updating loan document requirement:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ========== REGISTRATION DOCUMENTS ENDPOINTS ==========

// Get all registration documents
app.get("/make-server-0fddf210/registration-documents", async (c) => {
  try {
    const { data, error } = await supabase
      .from('registration_documents')
      .select('*')
      .order('registration_type', { ascending: true })
      .order('party_type', { ascending: true });

    if (error) {
      console.error("Error fetching registration documents:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    // Transform to frontend format
    const documents = data.map(doc => ({
      id: doc.id,
      registrationType: doc.registration_type,
      partyType: doc.party_type || null,
      documents: doc.documents || [],
      notice: doc.notice || '',
      updatedAt: doc.updated_at ? new Date(doc.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    }));

    return c.json({ success: true, documents });
  } catch (error) {
    console.error("Error fetching registration documents:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update registration document
app.put("/make-server-0fddf210/registration-documents/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { documents, notice } = body;

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (documents !== undefined) updateData.documents = documents;
    if (notice !== undefined) updateData.notice = notice;

    const { data, error } = await supabase
      .from('registration_documents')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating registration document:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    const document = {
      id: data.id,
      registrationType: data.registration_type,
      partyType: data.party_type || null,
      documents: data.documents || [],
      notice: data.notice || '',
      updatedAt: new Date(data.updated_at).toISOString().split('T')[0],
    };

    return c.json({ success: true, document });
  } catch (error) {
    console.error("Error updating registration document:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
