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
} from "@chakra-ui/react";

import { Field } from "../fields";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateCommunityModal: FC<Props> = ({ isOpen, onClose }) => {
  const { kit, contract } = useContract();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Community</ModalHeader>
        <ModalCloseButton />
        <HookedForm
          onSubmit={async ({ name }: any) => {
            await contract!.methods
              .createCommunity(name.toLowerCase().replaceAll(" ", ""))
              .send({ from: kit!.defaultAccount });
            alert("Community Successfully Created! 🎉", "success");
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <ModalBody>
                <Field fieldId="name" label="Name" placeholder="Enter a name" />
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

export default CreateCommunityModal;
