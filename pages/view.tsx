 import { Component, ReactNode } from 'react';
import Head from 'next/head';
import 'isomorphic-unfetch';

type Maybe<T> = T | null;

type Comment = {
    content: string;
    username: string;
    avatar: string;
};

type CommentProps = {
    key: number;
    comment: Comment;
};

const CommentItem = (props: CommentProps) => {
    return <li className="p-2 border-b border-grey-light text-md">
        <div className="font-semibold">{props.comment.username}</div>
        <div className="my-2" dangerouslySetInnerHTML={{ __html: props.comment.content }}></div>
    </li>;
};

type PropsType = {
    id: number;
    page: number;
    title: string;
    content: string;
    comments: Comment[];
};

export default class View extends Component<PropsType> {
    static async getInitialProps(params: any) {
        const data = await fetch(`https://p.voz.vn/posts/${params.query.id}`);
        const json = await data.json();
        const comments = await fetch(`https://p.voz.vn/posts/${params.query.id}/comments`);
        const comments_json = await comments.json();
        return {
            id: json.id,
            page: parseInt(params.query.page) || 1,
            title: json.title,
            content: json.content,
            comments: comments_json.results.map((c: any) => ({
                content: c.content,
                username: c.user_meta.display_name,
                avatar: c.user_meta.photo_url
            }))
        };
    }

    getFirstImage(input: string): Maybe<string> {
        const match: Maybe<RegExpMatchArray> = input.match(/<img.*?src=\"(.*?)\"/);
        if (match && match.length > 1) {
            return match[1];
        }
        return null;
    }

    render(): ReactNode {
        return (
            <div className="container max-w-md sm mx-auto p-4 font-sans text-md text-grey-darkest leading-normal">
                <Head>
                <title>{this.props.title}</title>
                <meta property="og:title" content={this.props.title} />
                <meta property="og:description" content=`Bấm vào link để xem chi tiết bài viết ${this.props.title}` />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={`https://voz-news.now.sh/view?id=${this.props.id}&page=${this.props.page}`} />
                <meta property="og:image" content={`${this.getFirstImage(this.props.content)}`} />
                </Head>
                <style jsx global>{`blockquote { background: #fafafa; padding: 10px; border-left: 2px solid #eee; }`}</style>
                <a href={`/index?page=${(this.props.page)}`} className="p-2 bg-transparent hover:bg-blue hover:text-white text-blue-dark font-semibold border border-blue rounded no-underline">← back</a>
                <h2 className="my-2">{this.props.title}</h2>
                <div className="my-2" dangerouslySetInnerHTML={{ __html: this.props.content }}></div>
                <ul className="p-5 my-2 bg-grey-lightest list-reset">
                { this.props.comments.map((c: Comment, id: number) => <CommentItem key={id} comment={c}/>) }
                </ul>
                <a href={`/index?page=${(this.props.page)}`} className="p-2 bg-transparent hover:bg-blue hover:text-white text-blue-dark font-semibold border border-blue rounded no-underline">← back</a>
            </div>
        )
    }
}
