import { Component, ReactNode } from 'react';
import 'isomorphic-unfetch';

type PropsType = {
    page: number;
    title: string;
    content: string;
};

export default class View extends Component<PropsType> {
    static async getInitialProps(params: any) {
        const data = await fetch(`https://p.voz.vn/posts/${params.query.id}`);
        const json = await data.json();
        return {
            page: parseInt(params.query.page) || 1,
            title: json.title,
            content: json.content
        };
    }

    render(): ReactNode {
        return (
            <div className="container max-w-md sm mx-auto p-4 font-sans text-md text-grey-darkest leading-normal">
                <style jsx global>{`blockquote { background: #fafafa; padding: 10px; border-left: 2px solid #eee; }`}</style>
                <a href={`/index?page=${(this.props.page)}`} className="p-2 bg-transparent hover:bg-blue hover:text-white text-blue-dark font-semibold border border-blue rounded no-underline">← back</a>
                <h2 className="my-2">{this.props.title}</h2>
                <div className="my-2" dangerouslySetInnerHTML={{ __html: this.props.content }}></div>
                <a href={`/index?page=${(this.props.page)}`} className="p-2 bg-transparent hover:bg-blue hover:text-white text-blue-dark font-semibold border border-blue rounded no-underline">← back</a>
            </div>
        )
    }
}
