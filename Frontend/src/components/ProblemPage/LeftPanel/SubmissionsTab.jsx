import SubmissionHistory from "../SubmissionHistory";

export default function SubmissionsTab({ problemId }) {
  return (
    <div>
      <div className="text-gray-500">
        <SubmissionHistory problemId={problemId} />
      </div>
    </div>
  );

}