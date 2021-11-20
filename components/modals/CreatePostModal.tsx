import { FC } from "react";

import { HookedForm } from "hooked-form";
import { useContract } from "lib/contractKit";

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from "@chakra-ui/react";

import { Field } from "../fields";

type Props = {
  isOpen: boolean;
  onClose: () => Promise<void>;
  communityIdx: number;
};

const CreatePostModal: FC<Props> = ({ isOpen, onClose, communityIdx }) => {
  const { kit, contract } = useContract();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Post</ModalHeader>
        <ModalCloseButton />
        <HookedForm
          onSubmit={async ({ title, content }: any) => {
            await contract!.methods
              .createPost(communityIdx, title, content)
              .send({ from: kit!.defaultAccount });
            alert("Post Successfully Created! 🎉", "success")
            await onClose();
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <ModalBody>
                <Field
                  fieldId="title"
                  label="Title"
                  placeholder="Enter a title"
                />
                <Field
                  fieldId="content"
                  label="Content"
                  placeholder="Type some content (markdown is supported)"
                  as={Textarea}
                />
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleSubmit}
                  isLoading={!!isSubmitting}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </HookedForm>
      </ModalContent>
    </Modal>
  );
};

export default CreatePostModal;
