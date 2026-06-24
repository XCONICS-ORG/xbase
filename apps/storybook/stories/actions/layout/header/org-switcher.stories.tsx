import type { Meta, StoryObj } from "@storybook/react";
import {
  OrgSwitcher,
  type HeaderOrganization,
} from "@xbase/design-system/components/modules/layout/header";
import { useState } from "react";

const organizations: HeaderOrganization[] = [
  { id: "org-xbase", name: "Xbase Systems" },
  { id: "org-north", name: "Northwind Operations" },
  { id: "org-acme", name: "Acme Field Services" },
];
const defaultOrganizationId = "org-xbase";

function OrgSwitcherPreview({
  withAddAction = true,
}: {
  withAddAction?: boolean;
}) {
  const [activeOrganizationId, setActiveOrganizationId] = useState(defaultOrganizationId);

  return (
    <OrgSwitcher
      activeOrganizationId={activeOrganizationId}
      avatarStyle="shapegrid"
      onAddOrganization={withAddAction ? () => undefined : undefined}
      onOrganizationChange={(organization) => setActiveOrganizationId(organization.id)}
      organizations={organizations}
    />
  );
}

const meta: Meta<typeof OrgSwitcher> = {
  title: "Actions/Layout/Header/OrgSwitcher",
  component: OrgSwitcher,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <OrgSwitcherPreview />,
};

export const WithoutAddAction: Story = {
  render: () => <OrgSwitcherPreview withAddAction={false} />,
};

export const Loading: Story = {
  args: {
    activeOrganizationId: defaultOrganizationId,
    avatarStyle: "shapegrid",
    loading: true,
    organizations,
  },
};

export const IdenticonVariant: Story = {
  render: () => {
    const [activeOrganizationId, setActiveOrganizationId] = useState(defaultOrganizationId);

    return (
      <OrgSwitcher
        activeOrganizationId={activeOrganizationId}
        avatarStyle="identicon"
        onOrganizationChange={(organization) => setActiveOrganizationId(organization.id)}
        organizations={organizations}
      />
    );
  },
};
