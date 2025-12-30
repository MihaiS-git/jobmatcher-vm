import { Accordion } from "@radix-ui/react-accordion";
import DrawerAccordionItem from "./DrawerAccordionItem";
import useAuth from "@/hooks/useAuth";

const DrawerAccordion = ({ close }: { close: () => void }) => {
  const auth = useAuth();
  const role = auth?.user?.role;

  const projectItems = [{ targetUrl: "/projects", itemTag: "Projects List" }];
  if (role === "CUSTOMER") {
    projectItems.push({
      targetUrl: "/projects/create",
      itemTag: "Create Project",
    });
  }

  const profileItems = [
    { targetUrl: "/profile", itemTag: "Profile" },
    { targetUrl: "/edit_public_profile", itemTag: "Public Profile" },
  ];
  if (role === "STAFF") {
    profileItems.push({ targetUrl: "/portfolio", itemTag: "Portfolio" });
  }

  const financialItems = [
    { targetUrl: "/contracts", itemTag: "Contracts" },
    { targetUrl: "/invoices", itemTag: "Invoices" },
    { targetUrl: "/payments", itemTag: "Payments" },
  ];

  const analyticsItems = [];
    if (role === "STAFF") {
      analyticsItems.push({ targetUrl: "/analytics/freelancer", itemTag: "Staff Analytics" });
    } else if (role === "CUSTOMER") {
      analyticsItems.push({ targetUrl: "/analytics/customer", itemTag: "Customer Analytics" });
    }

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full text-base font-medium text-blue-100 dark:text-gray-300"
      defaultValue="item-1"
    >
      <DrawerAccordionItem
        value="item-1"
        label="Projects"
        items={projectItems}
        close={close}
      />

      {role === "STAFF" && (
        <DrawerAccordionItem
          value="item-2"
          label="Proposals"
          items={[{ targetUrl: "/proposals", itemTag: "Proposals List" }]}
        close={close}

        />
      )}

      <DrawerAccordionItem
        value="item-3"
        label="Financial"
        items={financialItems}
        close={close}
      />

      <DrawerAccordionItem
        value="item-4"
        label="Profile"
        items={profileItems}
        close={close}
      />

      <DrawerAccordionItem
        value="item-5"
        label="Analytics"
        items={analyticsItems}
        close={close}
      />
    </Accordion>
  );
};

export default DrawerAccordion;
