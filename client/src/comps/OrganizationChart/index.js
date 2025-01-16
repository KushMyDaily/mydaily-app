import React from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import {
  Stat,
  StatLabel,
  StatNumber,
  Tag,
  Avatar,
  TagLabel,
  Card,
  CardBody,
  Flex,
  Text,
} from "@chakra-ui/react";
import Color from "../../utils/Color";
import { IconButton } from "@chakra-ui/react";
import { LuArrowDownFromLine } from "react-icons/lu";

const defineColor = (score) => {
  switch (true) {
    case score >= 9.5 && score <= 10:
      return Color.Amazing;
    case score >= 7.5 && score < 9.5:
      return Color.Great;
    case score >= 5.5 && score < 7.5:
      return Color.Good;
    case score >= 3.5 && score < 5.5:
      return Color.Alright;
    case score >= 1.5 && score < 3.5:
      return Color.Low;
    case score >= 0 && score < 1.5:
      return Color.Exhausted;
    default:
      return "#000000"; // Handle cases outside defined ranges
  }
};
// Recursive Tree Renderer
const renderNode = (node, onHandleExapand) => {
  return (
    <Flex justify="center">
      <Card variant="outline" width={"120px"}>
        <CardBody data-type="CardBody">
          <Stat>
            <StatLabel>{node.name}</StatLabel>
            {node.form && node.form !== null ? (
              <StatNumber color={defineColor(node.form)}>
                {node.form || 0}
              </StatNumber>
            ) : (
              <Text color={Color.Exhausted}>No Team</Text>
            )}
          </Stat>
          {node.form && (
            <IconButton
              aria-label="expand"
              onClick={() => onHandleExapand(node.id)}
              size="xs"
            >
              <LuArrowDownFromLine />
            </IconButton>
          )}
        </CardBody>
      </Card>
    </Flex>
  );
};

const renderRoot = (name, teamForm) => {
  return (
    <Flex justify="center">
      <Card
        //data-type="Card"
        //overflow="hidden"
        variant="outline"
        //bg="blackAlpha.900"
        width={"200px"}
      >
        <CardBody data-type="CardBody">
          <Stat>
            <StatLabel>Manager</StatLabel>
            <Tag size="lg" colorScheme="red" borderRadius="full">
              <Avatar
                src="https://bit.ly/sage-adebayo"
                size="xs"
                name="Segun Adebayo"
                ml={-1}
                mr={2}
              />
              <TagLabel>{name}</TagLabel>
            </Tag>
            <StatNumber color={defineColor(teamForm)}>
              {teamForm || 0}
            </StatNumber>
          </Stat>
        </CardBody>
      </Card>
    </Flex>
  );
};
const renderTree = (node, onHandleExapand) => {
  return (
    <TreeNode key={node.id} label={renderNode(node, onHandleExapand)}>
      {node.children && node.children.map((child) => renderTree(child))}
    </TreeNode>
  );
};

// Main Component
const OrganizationChart = ({ data, teamForm, onHandleExapand }) => {
  return (
    <Tree
      lineWidth="2px"
      lineColor="green"
      lineBorderRadius="10px"
      label={renderRoot(data.name, teamForm)}
    >
      {data.children &&
        data.children.map((child) => renderTree(child, onHandleExapand))}
    </Tree>
  );
};

export default OrganizationChart;
