import { RouteConfig, RouteProps } from "@medusajs/admin";
import { UserGroup } from "@medusajs/icons";
import { Container, Heading } from "@medusajs/ui";
import VendorTable from "../../modules/vendors/table";
import VendorSearch from "../../modules/vendors/search";

export const config: RouteConfig = {
  link: {
    label: "Vendors",
    icon: UserGroup,
  },
};

const VendorPage = ({ notify }: RouteProps) => {
  const onSuccess = (message: string) => {
    notify.success("Success", message);
  };
  const onError = (message: string) => {
    notify.error("Error", message);
  };

  return (
    <Container className="flex flex-col gap-y-8">
      <Heading>Vendors</Heading>
      <div className="flex flex-col gap-y-4">
        <div className="w-full flex justify-end">
          <VendorSearch />
        </div>
        <VendorTable onSuccess={onSuccess} onError={onError} />
      </div>
    </Container>
  );
};

export default VendorPage;
