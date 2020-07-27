import { createAddress } from '~utils/web3';

export const extractSgAddressFromDomainId = (idString: string): string =>
  createAddress(idString.replace(/_\d/, ''));

export const extractSgDomainId = (idString: string): number =>
  parseInt(idString.replace(/.+_/, ''), 10);

export const filterSgDomains = (domains: Array<any>, colonyAddress: string) =>
  domains.filter(({ id: idString }) => {
    const extractedColonyAddress = extractSgAddressFromDomainId(idString);
    return extractedColonyAddress === colonyAddress;
  });

export const normalizeSgDomains = (filteredDomains: Array<any>) =>
  filteredDomains.map(({ id, name }) => ({ id: extractSgDomainId(id), name }));
