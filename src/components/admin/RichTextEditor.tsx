import { useEffect, useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const [ReactQuill, setReactQuill] = useState<any>(null);

  useEffect(() => {
    // Dynamically import ReactQuill only on client side
    import('react-quill').then((mod) => {
      setReactQuill(() => mod.default);
    });
  }, []);

  useEffect(() => {
    // Import quill styles
    import('react-quill/dist/quill.snow.css');
  }, []);

  if (!ReactQuill) {
    return (
      <div className="min-h-[200px] border rounded p-4 bg-muted animate-pulse">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="quill-wrapper">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={{
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link'],
            ['clean']
          ]
        }}
        formats={[
          'header',
          'bold', 'italic', 'underline', 'strike',
          'list', 'bullet',
          'align',
          'link'
        ]}
        style={{ height: '200px', marginBottom: '50px' }}
      />
    </div>
  );
};
