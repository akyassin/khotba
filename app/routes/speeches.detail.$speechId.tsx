import {
  MetaFunction,
  LoaderFunction,
  ActionFunction,
  redirect,
} from "@remix-run/node";
import { Link, useLoaderData, Form } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";
import React, { useState } from "react";
import DeleteConfirmationModal from "~/components/DeleteConfirmationModal";

export const meta: MetaFunction = () => {
  return [
    { title: "Speech Details" },
    { name: "description", content: "Details of the speech" },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  const speechItem = await prisma.speech.findUnique({
    where: {
      id: Number(params.speechId),
    },
    include: {
      Language: true,
      RelatedSpeech: true,
    },
  });
  return { speechItem };
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  if (form.get("_method") === "delete") {
    await prisma.speech.delete({
      where: {
        id: Number(params.speechId),
      },
    });
    return redirect("/");
  }
};

export default function Speech() {
  const { speechItem } = useLoaderData<typeof loader>();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleDelete = () => {
    setModalOpen(true);
  };

  const confirmDelete = () => {
    setModalOpen(false);
    const form = document.getElementById("delete-form") as HTMLFormElement;
    form?.submit();
  };

  return (
    <div className="relative flex justify-center min-h-screen bg-gray-50">
      <div className="w-full sm:w-2/3 md:w-90% mt-16">
        <div className="mb-5">
          <Link
            to="/"
            className=" bg-red-500 hover:bg-red-700 text-white font-bold py-2 p-6 rounded"
          >
            Back
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-700 text-white p-4 rounded-t">
          <h2 className="text-2xl font-semibold mb-2 sm:mb-0">
            {speechItem.title}
          </h2>
          <div className="space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            {speechItem.RelatedSpeech && (
              <Link
                to={`/speeches/detail/${speechItem.RelatedSpeech.id}`}
                className="block sm:inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded w-full sm:w-32 text-center"
              >
                Translation
              </Link>
            )}
            <button className="block sm:inline-block bg-green-500 text-white font-bold py-1 px-2 rounded w-full sm:w-32 text-center">
              {speechItem.Language.name}
            </button>
            <Link
              to={`/speeches/edit/${speechItem.id}`}
              className="block sm:inline-block bg-blue-500 text-white font-bold py-1 px-2 rounded w-full sm:w-32 text-center"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="block sm:inline-block bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded w-full sm:w-32 text-center"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="bg-gray-200 p-4 rounded-b">
          <p className="mt-4">{speechItem.body}</p>
        </div>
      </div>
      <Form method="post" id="delete-form">
        <input type="hidden" name="_method" value="delete" />
      </Form>
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
