import type { APIRoute } from 'astro';
import { supabase } from '../../util/supabase.astro';
import parsePostFormData from '../../util/parse-post-form-data';
import validatePost from '../../util/validatePost';

export const POST: APIRoute = async ({ request }) => {
    const data = await request.formData();
    const postData = parsePostFormData(data);
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

    const errors = validatePost(postData);

    const hasErrors = Object.values(errors).some((msg) => msg);
    if (hasErrors) {
        return new Response(JSON.stringify({ errors }), { status: 400 });
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

    // Post exists, edit key matches, we have the data and it's all there

    const { data: editData, error: editError } = await supabase()
        .from('posts')
        .update({ ...postData, edited_at: new Date().toISOString() })
        .eq('id', postId)
        .select()
        .single();

    console.log(postData, editData, editError);

    if (editError) {
        // @ts-ignore(2339)
        errors.db = editError.message;
        return new Response(JSON.stringify(errors), { status: 500 });
    }

    if (!editData) {
        // @ts-ignore(2339)
        errors.db = 'something broke';
        return new Response(JSON.stringify(errors), { status: 500 });
    }

    return new Response(JSON.stringify(editData), { status: 200 });
};
