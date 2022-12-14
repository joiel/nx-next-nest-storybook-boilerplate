import { useEffect, useState } from 'react';
import { parseToken } from '@boilerplate-project/util-lib';

export const checkAccess = async ({ page, token }) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + parseToken(token),
    },
  };
  const resAuthCheck = await fetch(
    `${process.env.PUBLIC_API_GATEWAY}/auth/check`,
    options
  );
  const session = resAuthCheck.status !== 200 ? false : true;
  const authCheck = await resAuthCheck.json();

  page = page.substring(1);
  const resPermission = await fetch(
    `${process.env.PUBLIC_API_GATEWAY}/auth/permission?page=${page}&list=true`,
    options
  );
  const permission = await resPermission.json();
  return { session, authCheck, permission };
};

export const getModules = (includeLists: boolean = true) => {
  const [response, setResponse] = useState({ data: { modules: [] } });
  const [modules, setModules] = useState(null);
  useEffect(() => {
    fetch(`/api/auth/permission`, {
      method: 'POST',
      body: JSON.stringify({ includeLists }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => setResponse(data));
  }, []);

  useEffect(() => {
    if (response) {
      setModules(response.data.modules);
    }
  }, [response]);
  return modules;
};
