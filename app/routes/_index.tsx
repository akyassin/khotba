import { useState } from "react";
import { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Khotbas" },
    { name: "description", content: "Welcome to Friday Khotba Blog!" },
  ];
};

export const loader = async () => {
  const speeches = await prisma.speech.findMany({
    include: {
      Language: true,
    },
  });
  return { speeches };
};

export default function Index() {
  const { speeches } = useLoaderData<typeof loader>();

  // Group speeches by language
  const speechesByLanguage: { [key: string]: any[] } = {};
  speeches.forEach((speech) => {
    const language = speech.Language?.name || "Unknown";
    if (!speechesByLanguage[language]) {
      speechesByLanguage[language] = [];
    }
    speechesByLanguage[language].push(speech);
  });

  // Extract all languages
  const allLanguages = Object.keys(speechesByLanguage);

  // Initialize expandedLanguages with all available languages
  const [expandedLanguages, setExpandedLanguages] =
    useState<string[]>(allLanguages);

  // Function to toggle the expansion of a language
  const toggleLanguageExpansion = (language: string) => {
    setExpandedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((lang) => lang !== language)
        : [...prev, language]
    );
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-50">
      <div className="w-2/3 mt-16">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold text-center">Speeches</h1>
          <Link
            to={"/speeches/create"}
            className="bg-green-500 text-white px-3 py-2 rounded"
          >
            Create New Speech
          </Link>
        </div>
        {Object.entries(speechesByLanguage).map(([language, speeches]) => (
          <div key={language} className="mb-6">
            <button
              onClick={() => toggleLanguageExpansion(language)}
              className="w-full text-left bg-gray-700 text-white p-3 rounded-t"
            >
              <h2 className="text-xl font-semibold">
                {language} ({speeches.length})
              </h2>
            </button>
            {expandedLanguages.includes(language) && (
              <div className="bg-gray-200 p-4 rounded-b">
                <ul className="mt-2 pl-4 list-disc">
                  {speeches.map((speech: any) => (
                    <li key={speech.id} className="mb-2">
                      <Link
                        to={`speeches/detail/${speech.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {speech.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
