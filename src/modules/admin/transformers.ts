import { createAddress } from '~utils/web3';

export const extractSgAddressFromDomainId = (idString: string): string =>
  createAddress(idString.replace(/_\d/, ''));

export const filterSgDomains = (domains: Array<any>, colonyAddress: string) =>
  domains.filter(({ id: idString }) => {
    const extractedColonyAddress = extractSgAddressFromDomainId(idString);
    return extractedColonyAddress === colonyAddress;
  });
