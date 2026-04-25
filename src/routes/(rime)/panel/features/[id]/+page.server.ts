
import { pagesLoad, pagesActions } from 'rimecms/panel'

export const load = pagesLoad.collection.doc('features')
export const actions = pagesActions.collection.doc('features')