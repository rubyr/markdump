import type { APIRoute } from 'astro';
import { supabase } from '../../util/supabase.astro';


export const DELETE: APIRoute = async ({ request }) => {
    const data = await request.formData();
    const editKey = data.get('edit_key')?.toString();
    const postId = data.get('post_id')?.toString();

    if (!editKey) {
        return new Response(JSON.stringify({ edit_key: 'Missing field' }), {
            status: 400,
        });
    }
    if (!postId) {
        return new Response(JSON.stringify({ post_id: 'Missing field' }), {
            status: 400,
        });
    }

    const { data: dbPost, error: postError } = await supabase()
        .from('posts')
        .select()
        .eq('id', postId)
        .single();

    if (!dbPost) {
        return new Response(JSON.stringify({ post_id: 'Post not found' }), {
            status: 404,
        });
    }

    if (editKey !== dbPost.edit_key) {
        return new Response(JSON.stringify({ edit_key: 'Incorrect edit key' }), {
            status: 401
        });
    }

    // post exists and the edit key is correct. delete it!
    const { status } = await supabase()
        .from('posts')
        .delete()
        .eq('id', postId);

    return new Response(undefined, { status });
};
