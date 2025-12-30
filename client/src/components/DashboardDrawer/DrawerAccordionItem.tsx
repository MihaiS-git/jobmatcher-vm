import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import DrawerAccordionSubitem from "./DrawerAccordionSubitem";

interface DrawerAccordionItemProps {
    value: string;
    label: string;
    items: {targetUrl: string, itemTag: string}[];
    close: () => void;
}

interface Subitem {
    targetUrl: string;
     itemTag: string;
};

const DrawerAccordionItem = ({value, label, items, close }: DrawerAccordionItemProps) => {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="cursor-pointer hover:text-blue-950 dark:hover:text-blue-400">
        {label}
      </AccordionTrigger>
      <AccordionContent className="font-medium text-sm ms-4">
        <ul>
            {items.map((item: Subitem) => (
          <DrawerAccordionSubitem key={item.targetUrl} targetUrl={item.targetUrl} itemTag={item.itemTag} close={close} />
            ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
};

export default DrawerAccordionItem;
