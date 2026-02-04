import React from "react";
import CompanyInfo from "./CompanyInfo";
import FoundingInfo from "./FoundingInfo";
import SocialPage from "./SocialPage";

const CompanyFormWizard = () => {
  const [page, setPage] = React.useState(1);

  const goNext = () => setPage((p) => p + 1);

  return (
    <>
      {page === 1 && <CompanyInfo onNext={goNext} />}
      {page === 2 && <FoundingInfo onNext={goNext} />}
      {page === 3 && <SocialPage />}
    </>
  );
};

export default CompanyFormWizard;
