import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
};

// Urgency calculator logic (simplified version for backend)
function calculateUrgency(issueType: string, location: string, description: string): {
  score: number;
  level: 'Low' | 'Medium' | 'High' | 'Critical';
} {
  const ISSUE_URGENCY: Record<string, number> = {
    'Gas Leak': 95, 'Water Main Break': 90, 'Electrical Hazard': 90,
    'Fire Hazard': 95, 'Downed Power Line': 95, 'Pothole': 70,
    'Broken Streetlight': 65, 'Traffic Signal Malfunction': 85,
    'Blocked Drainage': 75, 'Damaged Road': 70, 'Missing Manhole Cover': 85,
    'Garbage Accumulation': 50, 'Illegal Dumping': 55, 'Graffiti': 40,
    'Overgrown Vegetation': 35, 'Sidewalk Damage': 60, 'Street Sign Damage': 55,
    'Noise Complaint': 30, 'Stray Animals': 45, 'Public Property Damage': 50,
  };

  const HIGH_TRAFFIC = ['downtown', 'main street', 'highway', 'school', 'hospital', 'gorakhpur', 'station', 'market', 'temple', 'university'];
  const SAFETY_KEYWORDS = ['dangerous', 'hazard', 'broken', 'exposed', 'leak'];

  let score = ISSUE_URGENCY[issueType] || 50;
  
  if (HIGH_TRAFFIC.some(area => location.toLowerCase().includes(area))) {
    score += 15;
  }
  
  if (SAFETY_KEYWORDS.some(word => description.toLowerCase().includes(word))) {
    score += 10;
  }

  score = Math.min(score, 100);

  let level: 'Low' | 'Medium' | 'High' | 'Critical';
  if (score >= 85) level = 'Critical';
  else if (score >= 65) level = 'High';
  else if (score >= 40) level = 'Medium';
  else level = 'Low';

  return { score, level };
}

// ==================== AUTH ROUTES ====================

// Sign up new user
app.post('/make-server-5b40dbc6/auth/signup', async (c) => {
  try {
    const { email, password, name, role = 'citizen' } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const supabase = getSupabaseClient();

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        role: role === 'admin' ? 'admin' : 'citizen'
      },
      email_confirm: true, // Auto-confirm since no email server configured
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      success: true, 
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
        role: data.user.user_metadata.role
      }
    });
  } catch (error) {
    console.error('Signup exception:', error);
    return c.json({ error: 'Failed to create account' }, 500);
  }
});

// Login user
app.post('/make-server-5b40dbc6/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Missing email or password' }, 400);
    }

    const supabase = getSupabaseClient();

    // Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    return c.json({ 
      success: true, 
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || 'User',
        role: data.user.user_metadata?.role || 'citizen'
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
      }
    });
  } catch (error) {
    console.error('Login exception:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

// Get user session (for existing login check)
app.post('/make-server-5b40dbc6/auth/session', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'No authorization header' }, 401);
    }

    const token = authHeader.split(' ')[1];
    const supabase = getSupabaseClient();

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || 'User',
        role: user.user_metadata?.role || 'citizen'
      }
    });
  } catch (error) {
    console.error('Session check error:', error);
    return c.json({ error: 'Session verification failed' }, 500);
  }
});

// ==================== ISSUE ROUTES ====================

// Create new issue
app.post('/make-server-5b40dbc6/issues', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.split(' ')[1];
    const supabase = getSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const issueData = await c.req.json();
    const { 
      type, 
      location, 
      description, 
      latitude, 
      longitude, 
      imageUrl 
    } = issueData;

    if (!type || !location) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Calculate urgency
    const urgency = calculateUrgency(type, location, description || '');

    // Create issue object
    const issue = {
      id: crypto.randomUUID(),
      type,
      location,
      description: description || '',
      latitude: latitude || null,
      longitude: longitude || null,
      imageUrl: imageUrl || null,
      status: 'Pending',
      urgency: urgency.level,
      urgencyScore: urgency.score,
      reportedBy: user.email,
      reportedByName: user.user_metadata?.name || 'User',
      reportedById: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in KV store
    await kv.set(`issue:${issue.id}`, issue);
    
    // Also add to user's issues list
    const userIssuesKey = `user_issues:${user.id}`;
    const existingUserIssues = await kv.get(userIssuesKey) || [];
    await kv.set(userIssuesKey, [...existingUserIssues, issue.id]);

    return c.json({ success: true, issue });
  } catch (error) {
    console.error('Create issue error:', error);
    return c.json({ error: 'Failed to create issue' }, 500);
  }
});

// Get all issues (admin) or user's issues (citizen)
app.get('/make-server-5b40dbc6/issues', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.split(' ')[1];
    const supabase = getSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userRole = user.user_metadata?.role || 'citizen';
    
    // Get all issues from KV store
    const allIssuesData = await kv.getByPrefix('issue:');
    const allIssues = allIssuesData.map((item: any) => item.value);

    let filteredIssues;
    if (userRole === 'admin') {
      // Admins see all issues
      filteredIssues = allIssues;
    } else {
      // Citizens see only their issues
      filteredIssues = allIssues.filter((issue: any) => 
        issue.reportedById === user.id
      );
    }

    // Sort by creation date (newest first)
    filteredIssues.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return c.json({ issues: filteredIssues });
  } catch (error) {
    console.error('Get issues error:', error);
    return c.json({ error: 'Failed to fetch issues' }, 500);
  }
});

// Get single issue by ID
app.get('/make-server-5b40dbc6/issues/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const issueId = c.req.param('id');
    const issue = await kv.get(`issue:${issueId}`);

    if (!issue) {
      return c.json({ error: 'Issue not found' }, 404);
    }

    return c.json({ issue });
  } catch (error) {
    console.error('Get issue error:', error);
    return c.json({ error: 'Failed to fetch issue' }, 500);
  }
});

// Update issue status (admin only)
app.put('/make-server-5b40dbc6/issues/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.split(' ')[1];
    const supabase = getSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userRole = user.user_metadata?.role || 'citizen';
    if (userRole !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const issueId = c.req.param('id');
    const updates = await c.req.json();

    const existingIssue = await kv.get(`issue:${issueId}`);
    if (!existingIssue) {
      return c.json({ error: 'Issue not found' }, 404);
    }

    const updatedIssue = {
      ...existingIssue,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`issue:${issueId}`, updatedIssue);

    return c.json({ success: true, issue: updatedIssue });
  } catch (error) {
    console.error('Update issue error:', error);
    return c.json({ error: 'Failed to update issue' }, 500);
  }
});

// Delete issue (admin only)
app.delete('/make-server-5b40dbc6/issues/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.split(' ')[1];
    const supabase = getSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userRole = user.user_metadata?.role || 'citizen';
    if (userRole !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const issueId = c.req.param('id');
    await kv.del(`issue:${issueId}`);

    return c.json({ success: true });
  } catch (error) {
    console.error('Delete issue error:', error);
    return c.json({ error: 'Failed to delete issue' }, 500);
  }
});

// Get issue statistics
app.get('/make-server-5b40dbc6/stats', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.split(' ')[1];
    const supabase = getSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userRole = user.user_metadata?.role || 'citizen';
    const allIssuesData = await kv.getByPrefix('issue:');
    const allIssues = allIssuesData.map((item: any) => item.value);

    let relevantIssues;
    if (userRole === 'admin') {
      relevantIssues = allIssues;
    } else {
      relevantIssues = allIssues.filter((issue: any) => 
        issue.reportedById === user.id
      );
    }

    const stats = {
      total: relevantIssues.length,
      pending: relevantIssues.filter((i: any) => i.status === 'Pending').length,
      inProgress: relevantIssues.filter((i: any) => i.status === 'In Progress').length,
      resolved: relevantIssues.filter((i: any) => i.status === 'Resolved').length,
      byUrgency: {
        critical: relevantIssues.filter((i: any) => i.urgency === 'Critical').length,
        high: relevantIssues.filter((i: any) => i.urgency === 'High').length,
        medium: relevantIssues.filter((i: any) => i.urgency === 'Medium').length,
        low: relevantIssues.filter((i: any) => i.urgency === 'Low').length,
      }
    };

    return c.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
});

export default app;