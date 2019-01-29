import Document, { Head, Main, NextScript } from 'next/document'

export default class NewsDocument extends Document {
    static async getInitialProps(ctx: any) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <html>
                <Head>
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css" rel="stylesheet"/>
                    <link href="/static/nprogress.css" rel="stylesheet" type="text/css"/>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
                    <meta charSet="utf-8"/>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        )
    }
}
