import { Component, ReactNode } from 'react';
import 'isomorphic-unfetch';

type NewsItem = {
    id: number;
    title: string;
    time: string;
    comments: number;
};

type PropsType = {
    page: number;
    items: NewsItem[];
};

export default class Index extends Component<PropsType> {
    static async getInitialProps(params: any) {
        const page = parseInt(params.query.page) || 1;
        const data = await fetch(`https://p.voz.vn/feed/?box=diembao&page=${page}`);
        const json = await data.json();
        const items: NewsItem[] = json.results.reduce((arr: NewsItem[], item: any) => {
            let date: Date = new Date(item.created);
            let dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            arr.push({
                id: item.id,
                title: item.title,
                time: dateString,
                comments: item.total_comments || 0
            });
            return arr;
        }, []);
        return { page: page, items: items };
    }

    render(): ReactNode {
        const news: ReactNode[] = this.props.items.map((item: NewsItem) => {
            return <li className="p-2 cursor-pointer hover:bg-blue-lightest" key={item.id}>
                <a className="no-underline text-grey-darkest" href={`/view?id=${item.id}&page=${this.props.page}`}>
                    {item.title}
                    <div className="text-sm text-grey-dark">{item.time} | {item.comments} comments</div>
                </a>
            </li>;
        });
        return (
            <div className="container max-w-md sm mx-auto p-4 font-sans text-md text-grey-darkest leading-normal">
                <a href="/" className="block bg-purple-darker text-white p-2 w-full mb-2 no-underline">voznews</a>
                <ul className="list-reset">{news}</ul>
                <div className="flex p-2">
                    <a href={`/index?page=${(this.props.page - 1)}`} className="no-underline p-2 bg-transparent hover:bg-blue hover:text-white text-blue-dark font-semibold border border-blue rounded">← back</a>
                    <span className="flex-1"></span>
                    <a href={`/index?page=${(this.props.page + 1)}`} className="no-underline p-2 bg-transparent hover:bg-blue hover:text-white text-blue-dark font-semibold border border-blue rounded">next →</a>
                </div>
            </div>
        )
}
}
