import {
    ActionIcon,
    Anchor,
    Box,
    Button,
    Center,
    Container,
    CopyButton,
    Group,
    Loader,
    PasswordInput,
    Stack,
    Table,
    Text,
    TextInput,
    Tooltip,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import {
    IconCheck,
    IconCopy,
    IconExternalLink,
    IconLock,
    IconLogout,
    IconPlus,
    IconTerminal2,
    IconTrash,
} from "@tabler/icons-react";
import { removePass, savePass, state } from "../lib/state";

interface Path {
    id: string;
    from: string;
    to: string;
}

// --- Cyberpunk style tokens ---
const CYAN = "#00f0ff";
const MAGENTA = "#ff2a6d";
const YELLOW = "#f5e642";
const DARK_BG = "#0a0a0f";
const PANEL_BG = "#0d0d18";
const BORDER = "#1a1a2e";

const neonGlow = (color: string, intensity = 8) =>
    `0 0 ${intensity}px ${color}44, 0 0 ${intensity * 2}px ${color}22`;

const neonText = (color: string) => ({
    color,
    textShadow: `0 0 7px ${color}88, 0 0 20px ${color}44`,
});

const cyberpunkInput: React.CSSProperties = {
    background: "#06060c",
    border: `1px solid ${BORDER}`,
    color: CYAN,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: 13,
};

const cyberpunkPanel: React.CSSProperties = {
    background: PANEL_BG,
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    position: "relative",
    overflow: "hidden",
};

const scanlineOverlay: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background:
        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.015) 2px, rgba(0,240,255,0.015) 4px)",
    pointerEvents: "none",
    zIndex: 1,
};

// Glitch keyframes injected once
const glitchCSS = `
@keyframes cyber-glitch {
  0%, 100% { text-shadow: 0 0 7px #00f0ff88, 0 0 20px #00f0ff44; }
  20% { text-shadow: -2px 0 #ff2a6d, 2px 0 #00f0ff; }
  40% { text-shadow: 2px 0 #ff2a6d, -2px 0 #00f0ff; }
  60% { text-shadow: 0 0 7px #00f0ff88, 0 0 20px #00f0ff44; }
}
@keyframes cyber-flicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
  20%, 24%, 55% { opacity: 0.6; }
}
@keyframes cyber-pulse {
  0%, 100% { box-shadow: 0 0 5px #00f0ff44, 0 0 10px #00f0ff22; }
  50% { box-shadow: 0 0 12px #00f0ff66, 0 0 24px #00f0ff33; }
}
@keyframes scanline-move {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}
`;

export default function Home() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [paths, setPaths] = useState<Path[]>([]);
    const [loading, setLoading] = useState(false);
    const [passInput, setPassInput] = useState("");
    const { pass } = useSnapshot(state);

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

    const createPath = async () => {
        if (!from.trim() || !to.trim()) return;
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

    const deletePath = async (id: string) => {
        await fetch(`/api/path/remove?id=${id}`, { method: "DELETE" });
        fetchPaths();
    };

    // Login screen
    if (pass !== "Makuro_123") {
        return (
            <>
                <style>{glitchCSS}</style>
                <Box
                    style={{
                        minHeight: "100vh",
                        background: `radial-gradient(ellipse at 50% 0%, #0d0d2b 0%, ${DARK_BG} 70%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* Floating scanline */}
                    <Box
                        style={{
                            position: "fixed",
                            left: 0,
                            right: 0,
                            height: 2,
                            background: `${CYAN}22`,
                            animation: "scanline-move 4s linear infinite",
                            zIndex: 999,
                            pointerEvents: "none",
                        }}
                    />

                    <Box
                        w={420}
                        p="xl"
                        style={{
                            ...cyberpunkPanel,
                            boxShadow: neonGlow(CYAN, 12),
                            animation: "cyber-pulse 3s ease-in-out infinite",
                        }}
                    >
                        <div style={scanlineOverlay} />
                        <Stack align="center" gap="lg" style={{ position: "relative", zIndex: 2 }}>
                            {/* Icon */}
                            <Box
                                p="sm"
                                style={{
                                    border: `2px solid ${CYAN}`,
                                    borderRadius: 4,
                                    boxShadow: neonGlow(CYAN),
                                }}
                            >
                                <IconLock size={28} color={CYAN} />
                            </Box>

                            {/* Title */}
                            <Stack gap={2} align="center">
                                <Text
                                    size="xl"
                                    fw={900}
                                    ff="monospace"
                                    style={{
                                        ...neonText(CYAN),
                                        letterSpacing: 4,
                                        textTransform: "uppercase",
                                        animation: "cyber-glitch 5s ease-in-out infinite",
                                    }}
                                >
                                    ACCESS TERMINAL
                                </Text>
                                <Text size="xs" ff="monospace" style={{ color: `${CYAN}88` }}>
                                    // authentication required
                                </Text>
                            </Stack>

                            {/* Input */}
                            <PasswordInput
                                w="100%"
                                placeholder="ENTER_PASSKEY"
                                size="md"
                                radius={2}
                                value={passInput}
                                onChange={(e) => setPassInput(e.currentTarget.value)}
                                onKeyDown={(e) => {
                                    if (passInput.length > 4 && e.key === "Enter") {
                                        savePass(passInput);
                                        setPassInput("");
                                    }
                                }}
                                styles={{
                                    input: cyberpunkInput,
                                    innerInput: { color: CYAN, fontFamily: "monospace" },
                                }}
                            />

                            {/* Button */}
                            <Button
                                fullWidth
                                size="md"
                                radius={2}
                                disabled={passInput.length <= 4}
                                onClick={() => {
                                    savePass(passInput);
                                    setPassInput("");
                                }}
                                ff="monospace"
                                fw={700}
                                styles={{
                                    root: {
                                        background: `linear-gradient(135deg, ${CYAN}22, ${MAGENTA}22)`,
                                        border: `1px solid ${CYAN}`,
                                        color: CYAN,
                                        textTransform: "uppercase",
                                        letterSpacing: 3,
                                        transition: "all 0.2s",
                                        "&:hover": {
                                            background: `${CYAN}33`,
                                            boxShadow: neonGlow(CYAN, 15),
                                        },
                                        "&:disabled": {
                                            background: "#06060c",
                                            borderColor: BORDER,
                                            color: "#333",
                                        },
                                    },
                                }}
                            >
                                AUTHENTICATE
                            </Button>

                            {/* Decorative bottom */}
                            <Group gap={4}>
                                {[...Array(20)].map((_, i) => (
                                    <Box
                                        key={i}
                                        w={i % 3 === 0 ? 16 : 8}
                                        h={2}
                                        style={{
                                            background: i % 5 === 0 ? MAGENTA : `${CYAN}44`,
                                        }}
                                    />
                                ))}
                            </Group>
                        </Stack>
                    </Box>
                </Box>
            </>
        );
    }

    // Main dashboard
    return (
        <>
            <style>{glitchCSS}</style>
            <Box
                style={{
                    minHeight: "100vh",
                    background: `radial-gradient(ellipse at 30% 0%, #0d0d2b 0%, ${DARK_BG} 50%)`,
                    padding: "24px 0",
                }}
            >
                {/* Moving scanline */}
                <Box
                    style={{
                        position: "fixed",
                        left: 0,
                        right: 0,
                        height: 1,
                        background: `${CYAN}15`,
                        animation: "scanline-move 6s linear infinite",
                        zIndex: 999,
                        pointerEvents: "none",
                    }}
                />

                <Container size="lg">
                    <Stack gap="md">
                        {/* Header */}
                        <Group justify="space-between" align="center" py="sm">
                            <Group gap="sm">
                                <IconTerminal2 size={24} color={CYAN} />
                                <Text
                                    size="lg"
                                    fw={900}
                                    ff="monospace"
                                    style={{
                                        ...neonText(CYAN),
                                        letterSpacing: 3,
                                        textTransform: "uppercase",
                                        animation: "cyber-flicker 4s linear infinite",
                                    }}
                                >
                                    PATH::MANAGER
                                </Text>
                                <Box
                                    w={8}
                                    h={8}
                                    style={{
                                        borderRadius: "50%",
                                        background: "#00ff41",
                                        boxShadow: "0 0 6px #00ff41, 0 0 12px #00ff4166",
                                    }}
                                />
                                <Text size="xs" ff="monospace" c="dimmed">
                                    ONLINE
                                </Text>
                            </Group>

                            <Button
                                variant="subtle"
                                size="xs"
                                radius={2}
                                leftSection={<IconLogout size={14} />}
                                onClick={removePass}
                                ff="monospace"
                                styles={{
                                    root: {
                                        color: MAGENTA,
                                        border: `1px solid ${MAGENTA}44`,
                                        textTransform: "uppercase",
                                        letterSpacing: 1,
                                        "&:hover": {
                                            background: `${MAGENTA}22`,
                                        },
                                    },
                                }}
                            >
                                DISCONNECT
                            </Button>
                        </Group>

                        {/* Decorative line */}
                        <Box
                            h={1}
                            style={{
                                background: `linear-gradient(90deg, ${CYAN}00, ${CYAN}66, ${MAGENTA}66, ${MAGENTA}00)`,
                            }}
                        />

                        {/* Create form */}
                        <Box p="md" style={cyberpunkPanel}>
                            <div style={scanlineOverlay} />
                            <Stack gap="sm" style={{ position: "relative", zIndex: 2 }}>
                                <Group gap="xs">
                                    <Text size="xs" ff="monospace" style={neonText(YELLOW)}>
                                        {">"} NEW_PATH
                                    </Text>
                                    <Box flex={1} h={1} style={{ background: `${YELLOW}22` }} />
                                </Group>

                                <Group align="end" grow>
                                    <TextInput
                                        label={
                                            <Text size="xs" ff="monospace" style={{ color: `${CYAN}88` }}>
                                                FROM://
                                            </Text>
                                        }
                                        placeholder="slug-path"
                                        radius={2}
                                        value={from}
                                        onChange={(e) => setFrom(e.currentTarget.value)}
                                        styles={{ input: cyberpunkInput }}
                                    />
                                    <TextInput
                                        label={
                                            <Text size="xs" ff="monospace" style={{ color: `${CYAN}88` }}>
                                                TARGET://
                                            </Text>
                                        }
                                        placeholder="https://destination.url"
                                        radius={2}
                                        value={to}
                                        onChange={(e) => setTo(e.currentTarget.value)}
                                        onKeyDown={(e) => e.key === "Enter" && createPath()}
                                        styles={{ input: cyberpunkInput }}
                                    />
                                    <Button
                                        leftSection={<IconPlus size={14} />}
                                        radius={2}
                                        onClick={createPath}
                                        disabled={!from.trim() || !to.trim()}
                                        ff="monospace"
                                        size="sm"
                                        style={{ flexGrow: 0, flexBasis: "auto" }}
                                        styles={{
                                            root: {
                                                background: `${CYAN}22`,
                                                border: `1px solid ${CYAN}88`,
                                                color: CYAN,
                                                textTransform: "uppercase",
                                                letterSpacing: 1,
                                                "&:hover": {
                                                    background: `${CYAN}33`,
                                                    boxShadow: neonGlow(CYAN),
                                                },
                                                "&:disabled": {
                                                    background: "#06060c",
                                                    borderColor: BORDER,
                                                    color: "#333",
                                                },
                                            },
                                        }}
                                    >
                                        DEPLOY
                                    </Button>
                                </Group>
                            </Stack>
                        </Box>

                        {/* Table */}
                        <Box style={cyberpunkPanel}>
                            <div style={scanlineOverlay} />
                            <Box style={{ position: "relative", zIndex: 2 }}>
                                {/* Table header bar */}
                                <Group
                                    px="md"
                                    py="xs"
                                    justify="space-between"
                                    style={{ borderBottom: `1px solid ${BORDER}` }}
                                >
                                    <Group gap="xs">
                                        <Text size="xs" ff="monospace" style={neonText(YELLOW)}>
                                            {">"} PATH_REGISTRY
                                        </Text>
                                        <Box
                                            px={6}
                                            py={1}
                                            style={{
                                                background: `${MAGENTA}22`,
                                                border: `1px solid ${MAGENTA}44`,
                                                borderRadius: 2,
                                            }}
                                        >
                                            <Text size="xs" ff="monospace" style={{ color: MAGENTA }}>
                                                {paths.length}
                                            </Text>
                                        </Box>
                                    </Group>
                                    <Text size="xs" ff="monospace" style={{ color: "#333" }}>
                                        v2.077
                                    </Text>
                                </Group>

                                {loading ? (
                                    <Center p="xl">
                                        <Group gap="sm">
                                            <Loader size="xs" color={CYAN} />
                                            <Text size="xs" ff="monospace" style={{ color: `${CYAN}88` }}>
                                                LOADING DATA STREAM...
                                            </Text>
                                        </Group>
                                    </Center>
                                ) : paths.length === 0 ? (
                                    <Center p="xl">
                                        <Stack align="center" gap="xs">
                                            <Text
                                                size="sm"
                                                ff="monospace"
                                                style={{ color: `${CYAN}44` }}
                                            >
                                                [ EMPTY REGISTRY ]
                                            </Text>
                                            <Text size="xs" ff="monospace" style={{ color: "#333" }}>
                                                // deploy your first path above
                                            </Text>
                                        </Stack>
                                    </Center>
                                ) : (
                                    <Table.ScrollContainer minWidth={600}>
                                        <Table
                                            verticalSpacing="xs"
                                            horizontalSpacing="md"
                                            styles={{
                                                th: {
                                                    fontFamily: "monospace",
                                                    fontSize: 11,
                                                    color: `${CYAN}66`,
                                                    textTransform: "uppercase",
                                                    letterSpacing: 2,
                                                    borderBottom: `1px solid ${BORDER}`,
                                                    padding: "10px 16px",
                                                },
                                                td: {
                                                    fontFamily: "monospace",
                                                    fontSize: 13,
                                                    borderBottom: `1px solid ${BORDER}`,
                                                    padding: "10px 16px",
                                                },
                                                tr: {
                                                    transition: "background 0.15s",
                                                    "&:hover": {
                                                        background: `${CYAN}08 !important`,
                                                    },
                                                },
                                            }}
                                        >
                                            <Table.Thead>
                                                <Table.Tr>
                                                    <Table.Th w={50}>IDX</Table.Th>
                                                    <Table.Th>SOURCE</Table.Th>
                                                    <Table.Th>DESTINATION</Table.Th>
                                                    <Table.Th w={120} style={{ textAlign: "right" }}>
                                                        CTRL
                                                    </Table.Th>
                                                </Table.Tr>
                                            </Table.Thead>
                                            <Table.Tbody>
                                                {paths.map((p, i) => (
                                                    <Table.Tr key={p.id}>
                                                        <Table.Td>
                                                            <Text
                                                                size="xs"
                                                                ff="monospace"
                                                                style={{ color: "#444" }}
                                                            >
                                                                {String(i + 1).padStart(2, "0")}
                                                            </Text>
                                                        </Table.Td>
                                                        <Table.Td>
                                                            <Box
                                                                display="inline-block"
                                                                px={8}
                                                                py={2}
                                                                style={{
                                                                    background: `${CYAN}11`,
                                                                    border: `1px solid ${CYAN}33`,
                                                                    borderRadius: 2,
                                                                }}
                                                            >
                                                                <Text
                                                                    size="xs"
                                                                    ff="monospace"
                                                                    style={neonText(CYAN)}
                                                                >
                                                                    /{p.from}
                                                                </Text>
                                                            </Box>
                                                        </Table.Td>
                                                        <Table.Td>
                                                            <Anchor
                                                                href={p.to}
                                                                target="_blank"
                                                                size="xs"
                                                                ff="monospace"
                                                                style={{
                                                                    color: `${MAGENTA}cc`,
                                                                    display: "inline-flex",
                                                                    alignItems: "center",
                                                                    gap: 6,
                                                                    textDecoration: "none",
                                                                    transition: "color 0.15s",
                                                                }}
                                                            >
                                                                {p.to.length > 45
                                                                    ? p.to.slice(0, 45) + "..."
                                                                    : p.to}
                                                                <IconExternalLink
                                                                    size={12}
                                                                    color={`${MAGENTA}88`}
                                                                />
                                                            </Anchor>
                                                        </Table.Td>
                                                        <Table.Td>
                                                            <Group gap={6} justify="flex-end">
                                                                <CopyButton
                                                                    value={`${window.location.origin}/${p.from}`}
                                                                >
                                                                    {({ copied, copy }) => (
                                                                        <Tooltip
                                                                            label={
                                                                                copied
                                                                                    ? "COPIED!"
                                                                                    : "COPY LINK"
                                                                            }
                                                                            withArrow
                                                                            styles={{
                                                                                tooltip: {
                                                                                    fontFamily:
                                                                                        "monospace",
                                                                                    fontSize: 10,
                                                                                    background: PANEL_BG,
                                                                                    border: `1px solid ${BORDER}`,
                                                                                    color: CYAN,
                                                                                },
                                                                            }}
                                                                        >
                                                                            <ActionIcon
                                                                                variant="subtle"
                                                                                size="sm"
                                                                                onClick={copy}
                                                                                style={{
                                                                                    border: `1px solid ${copied ? "#00ff41" : CYAN}33`,
                                                                                    color: copied
                                                                                        ? "#00ff41"
                                                                                        : CYAN,
                                                                                    background: copied
                                                                                        ? "#00ff4111"
                                                                                        : "transparent",
                                                                                }}
                                                                            >
                                                                                {copied ? (
                                                                                    <IconCheck size={14} />
                                                                                ) : (
                                                                                    <IconCopy size={14} />
                                                                                )}
                                                                            </ActionIcon>
                                                                        </Tooltip>
                                                                    )}
                                                                </CopyButton>
                                                                <Tooltip
                                                                    label="TERMINATE"
                                                                    withArrow
                                                                    styles={{
                                                                        tooltip: {
                                                                            fontFamily: "monospace",
                                                                            fontSize: 10,
                                                                            background: PANEL_BG,
                                                                            border: `1px solid ${BORDER}`,
                                                                            color: MAGENTA,
                                                                        },
                                                                    }}
                                                                >
                                                                    <ActionIcon
                                                                        variant="subtle"
                                                                        size="sm"
                                                                        onClick={() => deletePath(p.id)}
                                                                        style={{
                                                                            border: `1px solid ${MAGENTA}33`,
                                                                            color: MAGENTA,
                                                                        }}
                                                                    >
                                                                        <IconTrash size={14} />
                                                                    </ActionIcon>
                                                                </Tooltip>
                                                            </Group>
                                                        </Table.Td>
                                                    </Table.Tr>
                                                ))}
                                            </Table.Tbody>
                                        </Table>
                                    </Table.ScrollContainer>
                                )}
                            </Box>
                        </Box>

                        {/* Footer */}
                        <Group justify="center" gap="xs">
                            {[...Array(30)].map((_, i) => (
                                <Box
                                    key={i}
                                    w={i % 4 === 0 ? 20 : 6}
                                    h={1}
                                    style={{
                                        background:
                                            i % 7 === 0
                                                ? MAGENTA
                                                : i % 5 === 0
                                                  ? YELLOW
                                                  : `${CYAN}33`,
                                    }}
                                />
                            ))}
                        </Group>
                        <Text ta="center" size="xs" ff="monospace" style={{ color: "#333" }}>
                            SYS::PATH_MANAGER // {paths.length} REGISTERED NODES
                        </Text>
                    </Stack>
                </Container>
            </Box>
        </>
    );
}
