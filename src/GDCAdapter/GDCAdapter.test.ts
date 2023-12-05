import { toArray } from 'rxjs/operators'
import GDCAdapter from './GDCAdapter'
import configSchema from './configSchema'
import { gdcFilters, gdcResponse } from './test_data/gdc_test_data.js'
import fetchMock from 'jest-fetch-mock'
import { firstValueFrom } from 'rxjs'

fetchMock.enableMocks()

test('adapter can fetch features from the gdc', async () => {
  const adapter = new GDCAdapter(
    configSchema.create({
      GDCAdapterId: 'test-gdc-adapter',
      filters: JSON.stringify(gdcFilters),
    }),
  )

  fetchMock.mockResponseOnce(JSON.stringify(gdcResponse))

  const features = adapter.getFeatures({
    assemblyName: 'volvox',
    refName: 'chr3',
    start: 124900600,
    end: 124925000,
  })

  const names = await adapter.getRefNames()
  expect(names).toMatchSnapshot()

  const featuresArray = await firstValueFrom(features.pipe(toArray()))
  expect(featuresArray.slice(0, 3)).toMatchSnapshot()
})
