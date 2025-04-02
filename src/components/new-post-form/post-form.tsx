import { useState } from 'preact/hooks';
import styles from './post-form.module.css';
import type { NewPostErrors } from '../../pages/api/new';
import { navigate } from 'astro:transitions/client';
import type { ComponentChildren, ComponentProps } from 'preact';
import type { PostData } from '../../util/parse-post-form-data';

interface PostFormProps {
    onSubmit: (e: SubmitEvent) => void;
    errors: NewPostErrors;
    data?: PostData;
    children?: ComponentChildren;
}

const PostForm = ({ onSubmit, errors, data, children }: PostFormProps) => {
    return (
        <form onSubmit={onSubmit}>
            <section>
                <label>
                    Title (optional)
                    <input
                        type="text"
                        name="title"
                        placeholder="cool post"
                        value={data?.title}
                    />
                </label>
                {errors.title && <p class={styles.error}>{errors.title}</p>}
                <label>
                    Tags (optional)
                    <input
                        type="text"
                        name="tags"
                        placeholder="comma, separated, with spaces"
                        value={data?.tags.join(', ')}
                    />
                </label>
                {errors.tags && <p class={styles.error}>{errors.tags}</p>}
                <label>
                    Body
                    <textarea
                        name="body"
                        required
                        minlength={1}
                        placeholder="# hello, world!"
                    >
                        {data?.body}
                    </textarea>
                </label>
                {errors.body && <p class={styles.error}>{errors.body}</p>}
                <label>
                    <input
                        type="checkbox"
                        name="unlisted"
                        checked={data?.unlisted || true}
                    />{' '}
                    Unlisted (exclude this from search results)
                </label>
                {children}
                <button class="success">Submit</button>
            </section>
        </form>
    );
};

const NewPostForm = () => {
    const [errors, setErrors] = useState<NewPostErrors>({});

    async function submit(e: SubmitEvent) {
        e.preventDefault();
        setErrors({});
        const formData = new FormData(e.target as HTMLFormElement);
        const response = await fetch('/api/new', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        if (response.status >= 400) {
            setErrors(data.errors);
        }
        if (data.id) {
            navigate(`/posts/${data.id}?created=${data.edit_key}`);
        }
    }
    return <PostForm onSubmit={submit} errors={errors} />;
};

const EditPostForm = ({
    postId,
    editKey,
    postData,
}: {
    postId: string;
    editKey: string;
    postData: PostData;
}) => {
    const [errors, setErrors] = useState<NewPostErrors>({});

    async function submit(e: SubmitEvent) {
        e.preventDefault();
        setErrors({});
        const formData = new FormData(e.target as HTMLFormElement);
        const response = await fetch('/api/edit', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        if (response.status >= 400) {
            setErrors(data.errors);
        }
        if (data.id) {
            navigate(`/posts/${data.id}?created=${data.edit_key}`);
        }
    }

    return (
        <PostForm onSubmit={submit} errors={errors} data={postData}>
            <input hidden name="post_id" value={postId} />
            <input hidden name="edit_key" value={editKey} />
        </PostForm>
    );
};

export { NewPostForm, EditPostForm };
export default PostForm;
