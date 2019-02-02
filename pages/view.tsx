import React, { Component, ReactNode, MouseEventHandler, RefObject } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import 'isomorphic-unfetch';
import NProgress from 'nprogress'

const HostName = `https://voz.fullsnack.io`;

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
    return <li className="p-2 border-b border-grey-light">
        <div className="font-semibold">{props.comment.username}</div>
        <style jsx global>{`
        .comment-content .voz_smiley, .comment-content .voz_smiley_es, .comment-content img[id^=smil] {
            max-height: 40px;
            vertical-align: middle;
        }
        .comment-content blockquote img { display: block; height: 10px; width: 50%; background: #FFF; border: 1px dashed #ccc; padding: 5px; }`}</style>
        <div className="comment-content my-2 align-middle" dangerouslySetInnerHTML={{ __html: props.comment.content }}></div>
    </li>;
};

type PropsType = {
    id: number;
    page: number;
    title: string;
    content: string;
    comments: Comment[];
};

type StateType = {
    comments: Comment[];
    commentPage: number;
};

type CommentListPropType = {
    data: Comment[];
    page: number;
    onClick: MouseEventHandler;
};

const CommentList = (props: CommentListPropType) => {
    let result = props.data.map((c: Comment, id: number) => <CommentItem key={id} comment={c}/>);
    return (
        <div className="bg-grey-lightest my-2">
            <ul className="p-2 list-reset">{result}</ul>
            <button className="p-2 bg-transparent w-full hover:bg-blue hover:text-white text-blue-dark font-semibold border border-blue rounded no-underline mx-auto" onClick={props.onClick}>More Comment</button>
        </div>
    );
};

class ApiService {
    static getHost(): string {
        if (typeof window !== 'undefined') {
            return `${window.location.protocol}//${window.location.host}`;
        }
        return HostName;
    }

    static async getComments(id: number, page: number): Promise<Comment[]> {
        const comments = await fetch(`${this.getHost()}/api/comments?id=${id}&page=${page}`);
        const comments_json = await comments.json();
        if (comments_json && comments_json.results && comments_json.results.length) {
            return comments_json.results.map((c: any) => ({
                content: c.content,
                username: c.user_meta.display_name,
                avatar: c.user_meta.photo_url
            }));
        }
        return [];
    }

    static async getContent(id: number): Promise<any> {
        const data = await fetch(`${this.getHost()}/api/view?id=${id}`);
        const json = await data.json();
        return {
            id: json.id,
            title: json.title,
            content: json.content
        }
    }
}

export default class View extends Component<PropsType, StateType> {
    state: StateType = {
        comments: [],
        commentPage: 1
    };
    private scrollAnchorRef: RefObject<HTMLDivElement>;

    constructor(props: PropsType) {
        super(props);
        this.scrollAnchorRef = React.createRef();
    }
    
    static async getInitialProps(params: any) {        
        return {
            page: parseInt(params.query.page) || 1,
            ...await ApiService.getContent(params.query.id),
            comments: await ApiService.getComments(params.query.id, 1)
        };
    }

    getFirstImage(input: string): Maybe<string> {
        const match: Maybe<RegExpMatchArray> = input.match(/<img.*?src=\"(.*?)\"/);
        if (match && match.length > 1) {
            return match[1];
        }
        return null;
    }

    async loadNextComments() {
        NProgress.start();
        const comments = await ApiService.getComments(this.props.id, this.state.commentPage + 1);
        NProgress.done();
        this.scrollAnchorRef.current!.scrollIntoView();
        this.setState({
            commentPage: this.state.commentPage + 1,
            comments: comments
        });
    }

    render(): ReactNode {
        return (
            <div className="container max-w-md sm mx-auto p-4 font-sans md:text-sm sm:text-md text-grey-darkest leading-normal">
                <Head>
                <title>{this.props.title}</title>
                <meta property="og:title" content={this.props.title} />
                <meta property="og:description" content={`Bấm vào link để xem chi tiết bài viết ${this.props.title}`} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={`${HostName}/view?id=${this.props.id}&page=${this.props.page}`} />
                <meta property="og:image" content={`${this.getFirstImage(this.props.content)}`} />
                </Head>
                <style jsx global>{`blockquote { background: #fafafa; padding: 10px; border-left: 2px solid #eee; }`}</style>
                <Link href={`/index?page=${(this.props.page)}`}><a className="sticky pin-l pin-t p-2 -ml-20 bg-transparent hover:bg-blue hover:text-white text-blue-dark font-semibold border border-blue rounded no-underline">← back</a></Link>
                <h2 className="my-2 py-2">{this.props.title}</h2>
                <div className="my-2 text-justify" dangerouslySetInnerHTML={{ __html: this.props.content }}></div>
                <div ref={this.scrollAnchorRef}></div>
                <CommentList data={this.state.comments.length ? this.state.comments : this.props.comments} page={this.state.commentPage} onClick={this.loadNextComments.bind(this)}/>
            </div>
        )
    }
}
