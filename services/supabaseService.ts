import { supabase } from './supabase';
import { User, Client, ContentTask, Comment, ContentTarget, ClientPackage } from '../types';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

// ==================== AUTH ====================

export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
};

export const signUp = async (email: string, password: string, name: string, role: string = 'EQUIPE') => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
                role,
            },
        },
    });
    if (error) throw error;
    return data;
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

export const getSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
};

export const onAuthStateChange = (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback);
};

export const getCurrentUserData = async (userId: string): Promise<User | null> => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching current user details:', error);
        return null;
    }
    return data;
};

// ==================== USERS ====================

export const getUsers = async (): Promise<User[]> => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching users:', error);
        throw error;
    }

    return data || [];
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
    const { data, error } = await supabase
        .from('users')
        .insert([user])
        .select()
        .single();

    if (error) {
        console.error('Error creating user:', error);
        throw error;
    }

    return data;
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<User> => {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating user:', error);
        throw error;
    }

    return data;
};

export const deleteUser = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

// ==================== CLIENTS ====================

export const getClients = async (): Promise<Client[]> => {
    const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

    if (clientsError) {
        console.error('Error fetching clients:', clientsError);
        throw clientsError;
    }

    // Fetch targets for each client
    const clientsWithTargets = await Promise.all(
        (clientsData || []).map(async (client) => {
            const { data: targetsData, error: targetsError } = await supabase
                .from('content_targets')
                .select('*')
                .eq('client_id', client.id);

            if (targetsError) {
                console.error('Error fetching targets:', targetsError);
                return { ...client, targets: [] };
            }

            return { ...client, targets: targetsData || [] };
        })
    );

    return clientsWithTargets;
};

export const createClient = async (client: Omit<Client, 'id'>, targets: ContentTarget[]): Promise<Client> => {
    // Create client
    const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert([{
            name: client.name,
            sector: client.sector,
            logo: client.logo,
            active: client.active
        }])
        .select()
        .single();

    if (clientError) {
        console.error('Error creating client:', clientError);
        throw clientError;
    }

    // Create targets
    if (targets.length > 0) {
        const targetsToInsert = targets.map(target => ({
            client_id: clientData.id,
            label: target.label,
            count: target.count
        }));

        const { error: targetsError } = await supabase
            .from('content_targets')
            .insert(targetsToInsert);

        if (targetsError) {
            console.error('Error creating targets:', targetsError);
            // Rollback client creation
            await supabase.from('clients').delete().eq('id', clientData.id);
            throw targetsError;
        }
    }

    // Fetch the complete client with targets
    const clients = await getClients();
    const createdClient = clients.find(c => c.id === clientData.id);

    if (!createdClient) {
        throw new Error('Failed to fetch created client');
    }

    return createdClient;
};

export const updateClient = async (id: string, updates: Partial<Client>): Promise<Client> => {
    const { data, error } = await supabase
        .from('clients')
        .update({
            name: updates.name,
            sector: updates.sector,
            logo: updates.logo,
            active: updates.active
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating client:', error);
        throw error;
    }

    // If targets are updated, handle them separately
    if (updates.targets) {
        // Delete existing targets
        await supabase.from('content_targets').delete().eq('client_id', id);

        // Insert new targets
        if (updates.targets.length > 0) {
            const targetsToInsert = updates.targets.map(target => ({
                client_id: id,
                label: target.label,
                count: target.count
            }));

            await supabase.from('content_targets').insert(targetsToInsert);
        }
    }

    // Fetch the complete client with targets
    const clients = await getClients();
    const updatedClient = clients.find(c => c.id === id);

    if (!updatedClient) {
        throw new Error('Failed to fetch updated client');
    }

    return updatedClient;
};

export const deleteClient = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting client:', error);
        throw error;
    }
};

// ==================== CONTENT TASKS ====================

export const getTasks = async (): Promise<ContentTask[]> => {
    const { data: tasksData, error: tasksError } = await supabase
        .from('content_tasks')
        .select('*')
        .order('created_at', { ascending: false });

    if (tasksError) {
        console.error('Error fetching tasks:', tasksError);
        throw tasksError;
    }

    // Fetch attachments and links for each task
    const tasksWithDetails = await Promise.all(
        (tasksData || []).map(async (task) => {
            const { data: attachmentsData } = await supabase
                .from('task_attachments')
                .select('url')
                .eq('task_id', task.id);

            const { data: linksData } = await supabase
                .from('task_links')
                .select('url')
                .eq('task_id', task.id);

            return {
                ...task,
                attachments: attachmentsData?.map(a => a.url) || [],
                links: linksData?.map(l => l.url) || []
            };
        })
    );

    return tasksWithDetails;
};

export const createTask = async (task: Omit<ContentTask, 'id' | 'createdAt'>): Promise<ContentTask> => {
    // Create task
    const { data: taskData, error: taskError } = await supabase
        .from('content_tasks')
        .insert([{
            client_id: task.clientId,
            title: task.title,
            briefing: task.briefing,
            format: task.format,
            channel: task.channel,
            priority: task.priority,
            status: task.status,
            deadline: task.deadline,
            assigned_to: task.assignedTo,
            review_comment: task.reviewComment,
            reviewed_by: task.reviewedBy,
            reviewed_at: task.reviewedAt
        }])
        .select()
        .single();

    if (taskError) {
        console.error('Error creating task:', taskError);
        throw taskError;
    }

    // Create attachments
    if (task.attachments && task.attachments.length > 0) {
        const attachmentsToInsert = task.attachments.map(url => ({
            task_id: taskData.id,
            url
        }));

        await supabase.from('task_attachments').insert(attachmentsToInsert);
    }

    // Create links
    if (task.links && task.links.length > 0) {
        const linksToInsert = task.links.map(url => ({
            task_id: taskData.id,
            url
        }));

        await supabase.from('task_links').insert(linksToInsert);
    }

    // Fetch the complete task
    const tasks = await getTasks();
    const createdTask = tasks.find(t => t.id === taskData.id);

    if (!createdTask) {
        throw new Error('Failed to fetch created task');
    }

    return createdTask;
};

export const updateTask = async (id: string, updates: Partial<ContentTask>): Promise<ContentTask> => {
    const { data, error } = await supabase
        .from('content_tasks')
        .update({
            client_id: updates.clientId,
            title: updates.title,
            briefing: updates.briefing,
            format: updates.format,
            channel: updates.channel,
            priority: updates.priority,
            status: updates.status,
            deadline: updates.deadline,
            assigned_to: updates.assignedTo,
            review_comment: updates.reviewComment,
            reviewed_by: updates.reviewedBy,
            reviewed_at: updates.reviewedAt
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating task:', error);
        throw error;
    }

    // Update attachments if provided
    if (updates.attachments !== undefined) {
        await supabase.from('task_attachments').delete().eq('task_id', id);

        if (updates.attachments.length > 0) {
            const attachmentsToInsert = updates.attachments.map(url => ({
                task_id: id,
                url
            }));
            await supabase.from('task_attachments').insert(attachmentsToInsert);
        }
    }

    // Update links if provided
    if (updates.links !== undefined) {
        await supabase.from('task_links').delete().eq('task_id', id);

        if (updates.links.length > 0) {
            const linksToInsert = updates.links.map(url => ({
                task_id: id,
                url
            }));
            await supabase.from('task_links').insert(linksToInsert);
        }
    }

    // Fetch the complete task
    const tasks = await getTasks();
    const updatedTask = tasks.find(t => t.id === id);

    if (!updatedTask) {
        throw new Error('Failed to fetch updated task');
    }

    return updatedTask;
};

export const deleteTask = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('content_tasks')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
};

// ==================== COMMENTS ====================

export const getComments = async (taskId?: string): Promise<Comment[]> => {
    let query = supabase
        .from('comments')
        .select('*')
        .order('timestamp', { ascending: true });

    if (taskId) {
        query = query.eq('task_id', taskId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }

    return data || [];
};

export const createComment = async (comment: Omit<Comment, 'id'>): Promise<Comment> => {
    const { data, error } = await supabase
        .from('comments')
        .insert([{
            task_id: comment.taskId,
            user_id: comment.userId,
            text: comment.text,
            timestamp: comment.timestamp
        }])
        .select()
        .single();

    if (error) {
        console.error('Error creating comment:', error);
        throw error;
    }

    return data;
};

export const deleteComment = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
};
