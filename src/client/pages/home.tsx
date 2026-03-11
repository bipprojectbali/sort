import { Anchor, Button, Container, CopyButton, Group, Stack, Table, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { removePass, savePass, state } from "../lib/state";
interface Path {
    id: string;
    from: string;
    to: string;
}

export default function Home() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [paths, setPaths] = useState<Path[]>([]);
    const [loading, setLoading] = useState(false);
    const [passInput, setPassInput] = useState("");
    const { pass } = useSnapshot(state);


    // fetch list path
    const fetchPaths = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/path/list?page=1&limit=20");
            const json = await res.json();
            setPaths(json.data ?? []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaths();
    }, []);

    // create path
    const createPath = async () => {
        const res = await fetch("/api/path/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ from, to }),
        });
        const json = await res.json();
        if (json.success) {
            setFrom("");
            setTo("");
            fetchPaths();
        } else {
            alert(json.message || "Gagal membuat path");
        }
    };

    // delete path
    const deletePath = async (id: string) => {
        await fetch(`/api/path/remove?id=${id}`, { method: "DELETE" });
        fetchPaths();
    };

    if (pass !== "Makuro_123") {
        return (
            <Container>
                <div style={{ padding: 20 }}>
                    <h1>Path Manager</h1>
                    <TextInput value={passInput} onChange={(event) => {
                        setPassInput(event.currentTarget.value);
                    }} onKeyDownCapture={(key) => {
                        if (passInput.length > 4 && key.key === "Enter") {
                            console.log("enter");
                            savePass(passInput);
                            setPassInput("");
                        }
                    }} />


                </div>
            </Container>
        );
    }

    return (
        <Container>
            <Stack>
                <Group justify="end">
                    <Button variant="outline" color="red" onClick={removePass}>Logout</Button>
                </Group>
                <div style={{ padding: 20 }}>
                    <h1>Path Manager</h1>

                    <Group>
                        <TextInput
                            placeholder="from"
                            value={from}
                            onChange={(e) => setFrom(e.currentTarget.value)}
                        />
                        <TextInput
                            placeholder="to"
                            value={to}
                            onChange={(e) => setTo(e.currentTarget.value)}
                        />
                        <Button onClick={createPath}>Create</Button>
                    </Group>

                    <Table striped highlightOnHover withTableBorder mt="md">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>No</Table.Th>
                                <Table.Th>From</Table.Th>
                                <Table.Th>To</Table.Th>
                                <Table.Th>Action</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {paths.map((p, i) => (
                                <Table.Tr key={p.id}>
                                    <Table.Td>{i + 1}</Table.Td>
                                    <Table.Td>{p.from}</Table.Td>
                                    <Table.Td >
                                        <Anchor href={p.to} target="_blank">{p.to}</Anchor>
                                    </Table.Td>
                                    <Table.Td>
                                       <Group>
                                        <CopyButton value={`${window.location.origin}/${p.from}`} >
                                            {({ copied, copy }) => (
                                                <Button size="xs" variant={copied ? "default" : "outline"} onClick={copy}>
                                                    {copied ? "Copied!" : "Copy"}
                                                </Button>
                                            )}
                                        </CopyButton>
                                       <Button color="red" size="xs" onClick={() => deletePath(p.id)}>
                                            Delete
                                        </Button>
                                       </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>

                    {loading && <p>Loading...</p>}
                </div>
            </Stack>
        </Container>
    );
}
