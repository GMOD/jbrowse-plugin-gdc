import { toArray } from 'rxjs/operators'
import SegmentCNVAdapter from './SegmentCNVAdapter'
import configSchema from './configSchema'
import fetchMock from 'jest-fetch-mock'

fetchMock.enableMocks()

test('adapter can fetch features from segments.txt', async () => {
  const adapter = new SegmentCNVAdapter(
    configSchema.create({
      segLocation: {
        localPath: require.resolve(
          './test_data/8da2e4c4-e9e2-4af0-9352-3c54e7f4539c.grch38.seg.v2.txt',
        ),
      },
    }),
  )

  const features = adapter.getFeatures({
    assemblyName: 'volvox',
    refName: '3',
    start: 0,
    end: 200000,
  })

  const names = await adapter.getRefNames()
  expect(names).toMatchSnapshot()

  const featuresArray = await features.pipe(toArray()).toPromise()
  const featuresJsonArray = featuresArray.map(f => f.toJSON())
  expect(featuresJsonArray).toMatchSnapshot()
})
