
const STATUS_UPDATE_QUERY = `/status/session/info`;
const KYC_DETAILS = `/status/session/details`;

const getRequest = async (path: string, sessionId: string) => {
  const response = await fetch(`${process.env.KYC_ORACLE_ENDPOINT}${path}`, {
    method: 'GET',
    headers: {
      'Synaps-Session-Id': sessionId,
    },
  });
  return response.json();
};

export const getKycStatus = async (sessionId) => {
  const data = await getRequest(STATUS_UPDATE_QUERY, sessionId);
  return data;
};

export const getKycDetails = async (sessionId) => {
  const data = await getRequest(KYC_DETAILS, sessionId);
  return data;
};
