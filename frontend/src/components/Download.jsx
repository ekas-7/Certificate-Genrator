export default function Download({ pdfLink }) {
  return (
    <div>
      <a
        href={pdfLink}
        download
        target="_blank"
        rel="noopener noreferrer"
      >
        Download PDF
      </a>
    </div>
  );
}
