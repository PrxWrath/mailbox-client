import { useEffect, useCallback } from 'react'

const useFetch = (requestConfig, process) => {
   const sendRequest = useCallback(async() => {
   let res = await fetch(requestConfig.url, {
        method:requestConfig.method? requestConfig.method : 'GET',
        body: requestConfig.body? JSON.stringify(requestConfig.body): null
    })
    let data = await res.json();
    if(res.ok){
        if(process){
            process(data);
        }
        return true;
    }else{
        return false;
    }
    
  },[process, requestConfig])

  useEffect(()=>{
        sendRequest()
  }, [sendRequest])

return sendRequest;
}

export default useFetch