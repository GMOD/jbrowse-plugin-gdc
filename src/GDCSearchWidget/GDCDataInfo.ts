const mapToAdapter: Map<string, Object> = new Map([
  [
    'Copy Number Variation',
    {
      config: {
        type: 'QuantitativeTrack',
        adapter: { type: 'SegmentCNVAdapter' },
      },
      prefix: 'seg',
    },
  ],
  [
    'Sequencing Reads',
    {
      config: { type: 'AlignmentsTrack', adapter: { type: 'BamAdapter' } },
      prefix: 'bam',
    },
  ],
]);

/**
 * maps the data info to an appropriate data adapter
 * @param category the data category of the file
 * @param uri the uri of the data
 * @param isCompressed whether the data being retrieved is .gz and needs to be decompressed in its adapter
 * @param indexFileId the fileId of the index file that the data may require (BAM)
 * @returns an object containing the config type and the adapter object
 */
export function mapDataInfo(
  category: string,
  uri: string,
  isCompressed: boolean,
  indexFileId?: string
) {
  const configObject = mapToAdapter.get(category);
  let token = window.sessionStorage.getItem('GDCToken')

  if (configObject) {
    //@ts-ignore
    configObject.config.adapter[`${configObject.prefix}Location`] = { uri: uri, authHeader: 'X-Auth-Token', authToken: `${token}` };
    if (indexFileId) {
      //@ts-ignore
      configObject.config.adapter["index"] = {
        location: { uri: `http://localhost:8010/proxy/data/${indexFileId}`, authHeader: 'X-Auth-Token', authToken: `${token}`},
      };
    }
  }

  //configObject.adapter.isCompressed = isCompressed

  return configObject;
}