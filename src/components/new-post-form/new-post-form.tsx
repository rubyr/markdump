import { useState } from "preact/hooks";
import styles from "./new-post-form.module.css";
import type { NewPostErrors } from "../../pages/api/new";
import { navigate } from 'astro:transitions/client';

const NewPostForm = () => {
    const [responseMessage, setResponseMessage] = useState('');
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
        if (response.status === 400) {
            setErrors(data.errors);
        }
        if (data.id) {
            navigate(`/posts/${data.id}`);
        }
    }
    return (
        <form onSubmit={submit}>
            <section>
                <label>
                    Title (optional)
                    <input type="text" name="title" placeholder="cool post" />
                </label>
                {errors.title && <p class={styles.error}>{errors.title}</p>}
                <label>
                    Tags (optional)
                    <input
                        type="text"
                        name="tags"
                        placeholder="comma, separated, with spaces"
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
                    ></textarea>
                </label>
                {errors.body && <p class={styles.error}>{errors.body}</p>}
                <label>
                    <input type="checkbox" name="unlisted" checked /> Unlisted
                    (exclude this from search results)
                </label>
                <button class="success">Submit</button>
            </section>
        </form>
    );
};

export default NewPostForm;
