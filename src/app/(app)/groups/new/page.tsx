"use client";

import { GroupForm } from "@/components/groups/group-form";
import { PanelHeader } from "../../panels";

export default function NewGroupPage() {
  return (
    <div className="space-y-6">
      <PanelHeader title="Add new group" backHref="/groups" />
      <GroupForm />
    </div>
  );
}
