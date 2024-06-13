import { useActionData, useLoaderData } from "@remix-run/react";
import {
  ActionFunction,
  LoaderFunction,
  redirect,
  json,
} from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import SpeechForm from "~/components/SpeechForm"; // Adjust the import path

export const loader: LoaderFunction = async () => {
  const languages = await prisma.language.findMany();
  const speeches = await prisma.speech.findMany();
  return { languages, speeches };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");
  const languageId = formData.get("languageId");
  const relatedSpeechId = formData.get("relatedSpeechId");

  if (
    typeof title !== "string" ||
    typeof body !== "string" ||
    typeof languageId !== "string"
  ) {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  try {
    const newSpeech = await prisma.speech.create({
      data: {
        title,
        body,
        languageId: parseInt(languageId),
        relatedSpeechId: relatedSpeechId
          ? parseInt(relatedSpeechId as string)
          : null,
      },
    });

    if (relatedSpeechId) {
      await prisma.speech.update({
        where: { id: parseInt(relatedSpeechId.toString()) },
        data: {
          RelatedSpeech: {
            connect: { id: parseInt(newSpeech.id.toString()) },
          },
        },
      });
    }

    return redirect("/");
  } catch (error) {
    const err = error as { code?: string };

    if (err.code === "P2002") {
      return json(
        { error: "This translation is connected to another khotba.. " },
        { status: 500 }
      );
    } else {
      return json({ error: "Failed to create speech" }, { status: 500 });
    }
  }
};

export default function NewSpeech() {
  const { languages, speeches } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="w-full sm:w-2/3 md:w-90% mt-16">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-700 text-white p-4 rounded-t">
          <h2 className="text-2xl font-semibold mb-2 sm:mb-0">New Speech</h2>
        </div>{" "}
        {/* Render SpeechForm component */}
        <SpeechForm
          languages={languages}
          speeches={speeches}
          actionData={actionData}
          onSubmit={(data) => console.log(data)} // Add onSubmit function
        />
      </div>
    </div>
  );
}
