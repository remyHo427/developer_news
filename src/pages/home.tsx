/** @jsx h */
import { h } from "preact";
import ThreadHeader from "../components/thread_header";

function shuffle<T>(arr: T[]) {
    const a = arr.slice();

    for (let i = a.length; i; ) {
        const rand = Math.floor(Math.random() * i--);
        [a[i], a[rand]] = [a[rand], a[i]];
    }

    return a;
}

// fake
const threads: {
    title: string;
    subtitle: string;
    points: number;
    publishedAt: number;
    author: string;
}[] = [
    {
        title: "The Windows XP Waltz [Video]",
        subtitle: "youtube.com",
        points: 23,
        publishedAt: Date.now(), // just now
        author: "mike_d",
    },
    {
        title: "Sophia: Scalable Stochastic 2nd-Order Optimizer for Language Model Pre-Training",
        subtitle: "arxiv.org",
        points: 1,
        publishedAt: Date.now() - 60 * 5 * 1000, // 5 minutes ago
        author: "mike_d",
    },
    {
        title: "Improving Cloudflare Workers and D1 Developer Experience with Prisma ORM",
        subtitle: "cloudflare.com",
        points: 2,
        publishedAt: Date.now() - 24 * 3600 * 1000, // 1 day ago
        author: "chihwei",
    },
    {
        title: "In-Context Learning with Retrieved Demonstrations for Language Models",
        subtitle: "arxiv.org",
        points: 5,
        publishedAt: Date.now() - 10 * 3600 * 1000, // 10 hours ago,
        author: "tosh",
    },
    {
        title: "New-Vehicle Average Transaction Prices Retreat for Second Straight Month",
        subtitle: "coxautoinc.com",
        points: 1,
        publishedAt: Date.now() - 54 * 60 * 1000, // 54 minutes ago,
        author: "hunglee2",
    },
    {
        title: "Kube-Bench: Chequea la sequridad de tus clusters Kubernetes",
        subtitle: "sredevops.org",
        points: 2,
        publishedAt: Date.now() - 2 * 3600 * 1000, // 2 hours ago,
        author: "ngeorger",
    },
    {
        title: 'China\'s "overcapacity" reveals two different visions of the world',
        subtitle: "high-capacity.com",
        points: 3,
        publishedAt: Date.now() - 5 * 1000, // 5 seconds ago
        author: "gandan",
    },
    {
        title: "Tesla pitches robotaxi to stay relevant amid changing EV markets",
        subtitle: "notateslaapp.com",
        points: 1,
        publishedAt: Date.now() - 10 * 1000, // 10 seconds ago
        author: "standfest",
    },
];

const Home = () => {
    return (
        <div className="home">
            {threads.map((t, i) => (
                <ThreadHeader
                    title={t.title}
                    key={i}
                    author={t.author}
                    points={t.points}
                    publishedAt={t.publishedAt}
                    rank={i}
                    subtitle={t.subtitle}
                />
            ))}
        </div>
    );
};

export default Home;
