import type { APIRoute } from 'astro';
import { supabase } from '../../util/supabase.astro';
import sanitizeHtml from 'sanitize-html';

export interface NewPostErrors {
    title?: string;
    tags?: string;
    body?: string;
    unlisted?: string;
    db?: string;
}

export const POST: APIRoute = async ({ request }) => {
    const errors = { title: '', tags: '', body: '', db: '' };
    const data = await request.formData();
    const title = data.get('title');
    const tags = (() => {
        const rawtags = data.get('tags');
        if (!rawtags) return [];
        const split = rawtags
            .toString()
            .split(',')
            .map((s) => s.trim());
        return split;
    })();
    const bodyRaw = data.get('body')?.toString() ?? '';
    const body = sanitizeHtml(bodyRaw, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    });
    const unlisted = data.get('unlisted') === 'on'; // why.

    if (typeof title !== 'string' || title.length >= 256) {
        errors.title = 'Title is too long';
    }
    if (
        !Array.isArray(tags) ||
        tags.length > 50 ||
        tags.some((t) => t.length > 256)
    ) {
        // eventually we should split this and check tags individually
        errors.tags = 'tags is too long';
    }
    if (body.length < 1) {
        errors.body = 'Body is required';
    }
    if (body.length > 500_000) {
        errors.body = 'are you uploading the fucking odyssey? body is too long';
    }

    const hasErrors = Object.values(errors).some((msg) => msg);
    if (hasErrors) {
        return new Response(JSON.stringify({ errors }), { status: 400 });
    }

    // Do something with the data, then return a success response

    const { data: dbData, error } = await supabase()
        .from('posts')
        .insert({
            title,
            tags,
            body,
            unlisted,
        })
        .select();

    if (error) {
        errors.db = error.message;
        return new Response(JSON.stringify(errors), { status: 500 });
    }

    if (!dbData[0]) {
        errors.db = 'something broke';
        return new Response(JSON.stringify(errors), { status: 500 });
    }

    return new Response(JSON.stringify(dbData[0]), { status: 200 });
};
