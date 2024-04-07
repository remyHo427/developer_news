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

const toDisplayStr = (date: number): string => {
    return "1 hour";
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
                {rank} <button onClick={() => {}}>up</button>
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
                        &nbsp;{toDisplayStr(publishedAt)} ago
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
