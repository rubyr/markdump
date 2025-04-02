import type { PostData } from "./parse-post-form-data";

/**
 * @param post the post object to validate
 * @returns all the errors the post has - if none, all are blank strings
 */
const validatePost = (post: PostData) => {
    const errors = { title: '', tags: '', body: '' };
    const { title, tags, body, unlisted } = post;
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
    return errors;
};

export default validatePost;
