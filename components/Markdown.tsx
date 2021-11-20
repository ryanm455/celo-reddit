import React from "react";

import MarkdownJSX from "markdown-to-jsx";

/* eslint-disable react/no-children-prop */
import {
  Code,
  Divider,
  Heading,
  Image,
  Link,
  ListItem,
  OrderedList,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
} from "@chakra-ui/react";

const overrides = {
  p: (({ children }) => <Text mb={2}>{children}</Text>) as React.FC,
  em: (({ children }) => <Text as="em">{children}</Text>) as React.FC,
  blockquote: (({ children }) => (
    <Code as="blockquote" p={2}>
      {children}
    </Code>
  )) as React.FC,
  code: (({ children }) => (
    <Code
      whiteSpace="break-spaces"
      d="block"
      w="full"
      p={2}
      children={children}
    />
  )) as React.FC,
  del: (({ children }) => <Text as="del">{children}</Text>) as React.FC,
  hr: Divider,
  a: Link,
  img: Image,
  text: (({ children }) => <Text as="span">{children}</Text>) as React.FC,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  h1: (({ children }) => (
    <Heading my={4} as="h1" size="xl">
      {children}
    </Heading>
  )) as React.FC,
  h2: (({ children }) => (
    <Heading my={4} as="h2" size="lg">
      {children}
    </Heading>
  )) as React.FC,
  h3: (({ children }) => (
    <Heading my={4} as="h3" size="md">
      {children}
    </Heading>
  )) as React.FC,
  h4: (({ children }) => (
    <Heading my={4} as="h4" size="sm">
      {children}
    </Heading>
  )) as React.FC,
  h5: (({ children }) => (
    <Heading my={4} as="h5" size="xs">
      {children}
    </Heading>
  )) as React.FC,
  pre: Code,
  table: Table,
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  td: Td,
  th: Th,
};

const Markdown: React.FC = ({ children }) => (
  <MarkdownJSX options={{ overrides }}>{children as string}</MarkdownJSX>
);

export default Markdown;
