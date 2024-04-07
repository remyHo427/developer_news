/** @jsx h */
import { h } from "preact";

interface Props {
    title: string;
    subtitle: string;
    points: number;
    publishedAt: number;
    rank: number;
    author: string;
}

const div = (a: number, b: number) => Math.trunc(a / b);
const toDisplayStr = (date: number): string => {
    const diff = Date.now() - date;
    const s = div(diff, 1000);
    const m = div(s, 60);
    const h = div(m, 60);
    const d = div(h, 24);
    const y = div(d, 365);

    if (!s) {
        return `just now`;
    } else if (!m) {
        return `${s} seconds ago`;
    } else if (!h) {
        return `${m} minutes ago`;
    } else if (!d) {
        return `${h} hours ago`;
    } else if (!y) {
        return `${d} days ago`;
    } else {
        return `${y} years ago`;
    }
};
const ThreadHeader = ({
    title,
    subtitle,
    points,
    publishedAt,
    rank,
    author,
}: Props) => {
    return (
        <div className="thread-header">
            <div className="control">
                {rank + 1 + "."} <button onClick={() => {}}>▲</button>
            </div>
            <div className="content">
                <div className="primary">
                    <h2>{title}</h2>
                    <p className="sub">({subtitle})</p>
                </div>
                <div className="secondary">
                    <span>
                        {points} {points == 1 ? "point" : "points"} by&nbsp;
                        <span className="clickable">{author}</span>
                        &nbsp;{toDisplayStr(publishedAt)}
                    </span>
                    <span className="clickable">hide</span>
                    <span className="clickable">past</span>
                    <span className="clickable">discuss</span>
                </div>
            </div>
        </div>
    );
};

export default ThreadHeader;
