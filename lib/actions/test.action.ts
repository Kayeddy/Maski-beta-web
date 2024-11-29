export async function testClerk(clerkData: any) {
  const res = await fetch("http://user_service:9001/api/test/test-clerk", {
    method: "POST",
    headers: {
      Authorization: `${clerkData}`,
    },
  });

  return res.text();
}
