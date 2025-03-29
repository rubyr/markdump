import type { APIRoute, Params, } from 'astro';
import { supabase } from '../../../util/supabase.astro';

export const GET: APIRoute = async ({params, request}:{params: Params,request:any}) => {
    const postid = params.postid;
    if (typeof postid === 'undefined') {
        return new Response('What the fuck', { status: 500 });
    }
    const { data, error } = await supabase().from('posts').select().eq('id', postid);

    if (error || data.length === 0) {
        return new Response('Could not find requested resource', {status: 404});
    }
    
    if (data.length > 1) {
        return new Response('Huh??', {status: 500});
    }
    
    const content = data[0];
    
    return new Response(
        content.body,
        {headers: {'content-type': 'text/markdown; charset=utf-8'}}
    );
}