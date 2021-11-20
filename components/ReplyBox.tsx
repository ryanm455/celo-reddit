import { Field } from "components/fields";
import { HookedForm } from "hooked-form";
import { useComment } from "lib/CommentsStore";
import { useContract } from "lib/contractKit";

import {
  Button,
  Textarea,
} from "@chakra-ui/react";

type Props = {
  childCommentsIdx: number;
};

const ReplyBox: React.FC<Props> = ({ childCommentsIdx }) => {
  // form for writing and adding comments
  const { address, kit, contract } = useContract();
  const { refetchComments } = useComment();

  return address ? (
    <HookedForm
      onSubmit={async ({ content }: any) => {
        await contract!.methods
          .createComment(childCommentsIdx, content)
          .send({ from: kit!.defaultAccount });
        alert("Comment Added Successfully! 🎉", "success")
        await refetchComments();
      }}
    >
      {({ isSubmitting, handleSubmit }) => (
        <>
          <Field
            fieldId="content"
            label={`Comment as ${address}`}
            placeholder="Type what you think here"
            as={Textarea}
          />
          <Button
            mt={3}
            onClick={handleSubmit}
            isLoading={!!isSubmitting}
            colorScheme="blue"
          >
            Comment
          </Button>
        </>
      )}
    </HookedForm>
  ) : null;
};

export default ReplyBox;
