import {NavigationActions, StackActions} from 'react-navigation';

let _navigator;

export function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

export function navigate(routeName, params) {
  try {
    _navigator.dispatch(
      NavigationActions.navigate({
        routeName: routeName,
        params: params,
      }),
    );
  } catch (e) {
    console.warn('Navigation service error', JSON.stringify(e));
  }
}

export function resetAndNavigate(index, routeName) {
  const resetAction = StackActions.reset({
    index: index,
    actions: [NavigationActions.navigate({routeName: routeName})],
  });

  _navigator.dispatch(resetAction);
}
