import sanitizeHtml from 'sanitize-html';

export interface PostData {
    title: string,
    tags: string[],
    body: string,
    unlisted: boolean,
    adult_content: boolean,
}

const parsePostFormData = (data: FormData): PostData => {
    const title = data.get('title')?.toString().trim() ?? '';
    const tags = (() => {
        const rawtags = data.get('tags');
        if (!rawtags) return [];
        const split = rawtags
            .toString()
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
        return split;
    })();
    const bodyRaw = data.get('body')?.toString().trim() ?? '';
    const body = sanitizeHtml(bodyRaw, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    });
    const unlisted = data.get('unlisted') === 'on'; // why.
    const adult_content = data.get('adult_content') === 'on';

    return {
        title,
        tags,
        body,
        adult_content,
        unlisted
    };
};

export default parsePostFormData;
