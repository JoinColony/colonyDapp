import { bigNumberify } from 'ethers/utils';
import { isAddress } from 'web3-utils';
import { getNetworkClient } from './utils/network-client-helpers';

let colonyToken;
let colonyAddress;

describe('`ColonyClient` is able to', () => {
  test('Create a new Colony (instance)', async () => {
    /*
     * Get the network client
     */
    const networkClient = await getNetworkClient();
    /*
     * There should only be one colony at this point, the meta colony
     */
    const { count: coloniesBefore } = await networkClient.getColonyCount.call();
    /*
     * Create a new colony
     */
    const colonyClientInstance = await networkClient.createColony.send(
      {
        tokenAddress: await networkClient.createToken({
          name: 'Integration Test Token',
          symbol: 'ITT',
        }),
      },
      {
        gasLimit: bigNumberify(7000000),
        waitForMining: true,
      },
    );
    expect(colonyClientInstance).toHaveProperty('eventData');
    expect(colonyClientInstance.eventData).toHaveProperty('colonyId');
    expect(colonyClientInstance.eventData).toHaveProperty('colonyAddress');
    /*
     * Get the Colony's Instance
     */
    const colonyClient = await networkClient.getColonyClient(
      colonyClientInstance.eventData.colonyId,
    );
    expect(isAddress(colonyClient.contract.address)).toBeTruthy();
    /*
     * Save address for later (so we can check against)
     */
    colonyAddress = colonyClient.contract.address;
    /*
     * Check if valid methods are available
     */
    expect(colonyClient).toHaveProperty('getTask');
    expect(colonyClient).toHaveProperty('getNonRewardPotsTotal');
    expect(colonyClient).toHaveProperty('getPotBalance');
    expect(colonyClient).toHaveProperty('getTaskCount');
    expect(colonyClient).toHaveProperty('getTaskPayout');
    expect(colonyClient).toHaveProperty('getTaskRole');
    expect(colonyClient).toHaveProperty('getTaskWorkRatings');
    expect(colonyClient).toHaveProperty('getTaskWorkRatingSecret');
    expect(colonyClient).toHaveProperty('getToken');
    expect(colonyClient).toHaveProperty('addDomain');
    expect(colonyClient).toHaveProperty('addGlobalSkill');
    expect(colonyClient).toHaveProperty('assignWorkRating');
    expect(colonyClient).toHaveProperty('cancelTask');
    expect(colonyClient).toHaveProperty('claimColonyFunds');
    expect(colonyClient).toHaveProperty('claimPayout');
    expect(colonyClient).toHaveProperty('createTask');
    expect(colonyClient).toHaveProperty('finalizeTask');
    expect(colonyClient).toHaveProperty('mintTokens');
    expect(colonyClient).toHaveProperty('mintTokensForColonyNetwork');
    expect(colonyClient).toHaveProperty('moveFundsBetweenPots');
    expect(colonyClient).toHaveProperty('revealTaskWorkRating');
    expect(colonyClient).toHaveProperty('submitTaskDeliverable');
    expect(colonyClient).toHaveProperty('submitTaskWorkRating');
    /*
     * Save the tokens address for later (so we can check against)
     */
    colonyToken = await colonyClient.getToken.call().address;
    /*
     * There should two colonies now, the meta colony, and the one newly created
     */
    const coloniesAfter = await networkClient.getColonyCount.call();
    expect(coloniesAfter).toHaveProperty('count', coloniesBefore + 1);
  });
  test('Recover an existing Colony', async () => {
    /*
     * Get the network client
     */
    const networkClient = await getNetworkClient();
    /*
     * Recover the colony using it's name
     */
    const recoveredColonyClientInstance = await networkClient.getColonyClientByAddress(
      colonyAddress,
    );
    /*
     * The recovered Colony should have the same contract address and token
     * address as the one created previously
     */
    expect(recoveredColonyClientInstance.contract.address).toEqual(
      colonyAddress,
    );
    expect(await recoveredColonyClientInstance.getToken.call().address).toEqual(
      colonyToken,
    );
  });
});

/*
Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.
 */

/*
 Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

 Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

 Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

 Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

 Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

 Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

 Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

 Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

 Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

 Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

 Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

 Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

 Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

 Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

 Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

 Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

 Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

 Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

 Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

 Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

 Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

 Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

 Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

 Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

 Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

 Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

 Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

 Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

 Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

 Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

 Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

 Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

 Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

 Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

 Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

 Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

 Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

 Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

 Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

 Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

 Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

 Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

 Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

 Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

 Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

 Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

 Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

 Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

 Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

 Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

 Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.

 Long clothes grog blossom Brethren of the Coast marooned Privateer Jack Ketch lateen sail come about trysail smartly. Cable trysail landlubber or just lubber topgallant scuttle mizzen Privateer rope's end squiffy hempen halter. Holystone warp lanyard starboard ho haul wind mizzenmast hands Admiral of the Black lad.

 Run a shot across the bow Cat o'nine tails nipperkin Sea Legs doubloon knave interloper American Main weigh anchor topgallant. Strike colors log Jolly Roger loaded to the gunwalls Sea Legs cutlass furl case shot doubloon swab. Scuttle bilged on her anchor Yellow Jack loot ahoy grapple loaded to the gunwalls Buccaneer reef sails Jack Tar.

 Bucko swing the lead me Plate Fleet execution dock skysail rigging keelhaul man-of-war nipper. Jib mizzen hail-shot pillage draught strike colors topsail cable come about transom. Sutler tackle bilge hail-shot measured fer yer chains carouser Yellow Jack take a caulk transom matey.
  */
