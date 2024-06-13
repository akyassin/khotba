import { Form, Link } from "@remix-run/react";
import Select, { SingleValue } from "react-select";
import { Language, Speech } from "@prisma/client";
import { useState, useEffect } from "react";

interface SpeechFormProps {
  speech?: Speech;
  languages: Language[];
  speeches: Speech[];
  actionData: { error?: string };
  onSubmit: (data: any) => void;
}

const SpeechForm: React.FC<SpeechFormProps> = ({
  speech,
  languages,
  speeches,
  actionData,
  onSubmit,
}) => {
  const [selectedSpeech, setSelectedSpeech] = useState<
    SingleValue<{ value: number; label: string }>
  >(
    speech?.relatedSpeechId
      ? {
          value: speech.relatedSpeechId,
          label:
            speeches.find((s: Speech) => s.id === speech.relatedSpeechId)
              ?.title ?? "",
        }
      : null
  );

  const [selectedLanguage, setSelectedLanguage] = useState<
    SingleValue<{ value: number; label: string }>
  >(
    speech?.languageId
      ? {
          value: speech.languageId,
          label:
            languages.find((l: Language) => l.id === speech.languageId)?.name ??
            "",
        }
      : null
  );

  const speechOptions = speeches.map((speech: Speech) => ({
    value: speech.id,
    label: speech.title,
  }));

  const languageOptions = languages.map((language: Language) => ({
    value: language.id,
    label: language.name,
  }));

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderRadius: 0,
    }),
  };

  useEffect(() => {
    if (speech) {
      setSelectedSpeech(
        speech.relatedSpeechId
          ? {
              value: speech.relatedSpeechId,
              label:
                speeches.find((s: Speech) => s.id === speech.relatedSpeechId)
                  ?.title ?? "",
            }
          : null
      );
      setSelectedLanguage(
        speech.languageId
          ? {
              value: speech.languageId,
              label:
                languages.find((l: Language) => l.id === speech.languageId)
                  ?.name ?? "",
            }
          : null
      );
    }
  }, [speech, languages, speeches]);

  return (
    <Form method="post" className="bg-white p-8 rounded shadow-md">
      <div className="mb-4">
        <label className="block text-gray-700">
          Title*:{" "}
          <input
            type="text"
            name="title"
            defaultValue={speech?.title}
            required
            className="p-2 mt-1 h-[38px] shadow-sm block w-full border border-gray-300 focus:border-2 focus:border-[#3B82F6] focus:border-opacity-90 focus:outline-none "
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">
          Body*:{" "}
          <textarea
            defaultValue={speech?.body}
            name="body"
            required
            className="mt-1 p-2 shadow-sm min-h-[200px] block w-full border border-gray-300  focus:border-2 focus:border-[#3B82F6] focus:border-opacity-90 focus:outline-none"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">
          Language*:{" "}
          <Select
            required={true}
            options={languageOptions}
            value={selectedLanguage}
            onChange={(
              selectedOption: SingleValue<{ value: number; label: string }>
            ) => setSelectedLanguage(selectedOption)}
            isClearable
            isSearchable={false}
            placeholder="Select a language..."
            className="mt-1"
            styles={customStyles}
            name="languageId"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">
          Related Speech (optional):
          <Select
            options={speechOptions}
            value={selectedSpeech}
            onChange={(
              selectedOption: SingleValue<{ value: number; label: string }>
            ) => setSelectedSpeech(selectedOption)}
            isClearable
            placeholder="Search for a speech..."
            className="mt-1"
            styles={customStyles}
            name="relatedSpeechId"
          />
        </label>
      </div>
      {actionData?.error && <p className="text-red-500">{actionData.error}</p>}
      <div className="mt-10 flex justify-end">
        <Link
          to="/"
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 p-4 rounded mr-2"
        >
          Back
        </Link>
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
        >
          {speech ? "Update" : "Create"}
        </button>
      </div>
    </Form>
  );
};

export default SpeechForm;
