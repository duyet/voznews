import { Component, ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import 'isomorphic-unfetch';

const nsfwKeywords: string[] = ['bikini', 'nóng bỏng', 'bỏng mắt', 'ngắm', 'nhan sắc', 'bốc lửa',
                                'dung tục', 'dàn diễn viên', 'hot girl', 'nội y', 'hoa hậu', 'người đẹp',
                                'đồng tính', 'tiên nữ', 'đen tối', 'khiêu dâm', 'vũ nữ', 'khỏa thân',
                                'thác loạn', 'nữ sinh', 'yêu râu xanh', 'bồ', 'vú', 'ngực khủng', 'sex',
                                'dâm', 'á hậu', 'đỏ mặt', 'mỏng', 'chuyện người lớn'];

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

const QuickPaginator = (props: any) => {
    const page = props.page;
    return <div className="flex-1 flex">
        { Array(10).fill(0).map((_: number, i: number) => <Link key={i} href={`/index?page=${(page + i)}`}><a className={`no-underline mx-1 text-center flex-1 p-2 hover:bg-blue hover:text-white font-semibold border border-blue rounded ${i == 0 ? 'bg-blue text-white' : 'bg-transparent text-blue-dark'}`}>{page + i}</a></Link>) }
    </div>;
};

export default class Index extends Component<PropsType> {
    static async getInitialProps(params: any) {
        const page = parseInt(params.query.page) || 1;
        let host = '';
        if (params.req && params.req.get) {
            host = `${params.req.protocol}://${params.req.get('Host')}`;
        } else if (typeof window !== 'undefined') {
            host = `${window.location.protocol}//${window.location.host}`;
        }
        const data = await fetch(`${host}/api/list?page=${page}`);
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

    hasNsfwTag(item: NewsItem): boolean {
        const input = item.title.toLowerCase();
        for (const key of nsfwKeywords) {
            if (input.match(key) !== null) {
                return true;
            }
        }
        return false;
    }

    render(): ReactNode {
        const news: ReactNode[] = this.props.items.map((item: NewsItem) => {
            return <li className="p-2 cursor-pointer hover:bg-blue-lightest" key={item.id}>
                <Link href={`/view?id=${item.id}&page=${this.props.page}`}>
                <a className="no-underline text-grey-darkest">
                    {item.title}
                    <div className="text-sm text-grey-dark">{this.hasNsfwTag(item) ? (<span><span className="text-red text-sm">nsfw</span> | </span>) : ''} {item.time} | {item.comments} comments</div>
                </a>
                </Link>
            </li>;
        });
        return (
            <div className="container max-w-md sm mx-auto p-4 font-sans text-md text-grey-darkest leading-normal">
                <Head>
                    <title>Tin tức tổng hợp</title>
                </Head>
                <a href="/" className="block bg-purple-darker text-white p-2 w-full mb-2 no-underline">voznews</a>
                <ul className="list-reset">{news}</ul>
                <div className="flex p-2 text-sm">
                    <Link href={`/index?page=${(this.props.page - 1)}`}><a className="no-underline flex-no-shrink p-2 bg-transparent hover:bg-blue hover:text-white text-blue-dark font-semibold border border-blue rounded">← back</a></Link>
                    <QuickPaginator page={this.props.page} />
                    <Link href={`/index?page=${(this.props.page + 1)}`}><a className="no-underline flex-no-shrink p-2 bg-transparent hover:bg-blue hover:text-white text-blue-dark font-semibold border border-blue rounded">next →</a></Link>
                </div>
            </div>
        )
}
}
