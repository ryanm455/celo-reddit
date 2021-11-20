import { HookedForm } from "hooked-form";
import { sendCUSD } from "lib/contractMethods";

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

import { NumberField } from "../fields";

type Props = {
  address: string;
  isOpen: boolean;
  onClose: () => void;
};

const AwardModal: React.FC<Props> = ({ address, isOpen, onClose }) => {
  const { kit } = useContract();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Award User</ModalHeader>
        <ModalCloseButton />
        <HookedForm
          onSubmit={({ amount }: any) => sendCUSD(kit as any, address, amount)}
          initialValues={{ amount: 1 }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <ModalBody>
                <NumberField
                  fieldId="amount"
                  placeholder="cUSD"
                  label="cUSD Amount"
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
                  Send
                </Button>
              </ModalFooter>
            </>
          )}
        </HookedForm>
      </ModalContent>
    </Modal>
  );
};

export default AwardModal;
